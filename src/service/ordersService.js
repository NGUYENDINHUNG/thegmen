import Order from "../model/orderModel.Schema.js";
import Cart from "../model/cartModel.schema.js";
import Product from "../model/productModel.schema.js";
import Address from "../model/addressModel.schema.js";
import { validateAndApplyVoucherService } from "./VouchersSevice.js";

export const createOrderService = async (userId, addressId, voucherCode) => {
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }
    const orderItems = [];
    let totalAmount = 0;
    cart.items.forEach((item) => {
      const product = item.productId;
      const itemPrice = product.price * item.quantity;
      totalAmount += itemPrice;

      orderItems.push({
        productId: product._id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
      });
    });
  

    let voucherDiscount = 0;
    let voucherInfo = null;
    let originalTotal = totalAmount;

    if (voucherCode) {
      try {
        const result = await validateAndApplyVoucherService(
          voucherCode,
          totalAmount,
          userId
        );
        voucherDiscount = result.discountAmount; //10,000
        totalAmount = result.finalAmount; // 40,000
        voucherInfo = {
          id: result.voucher._id,
          code: result.voucher.code,
          discountType: result.voucher.discountType,//loại giảm
          discountValue: result.voucher.discountValue,//giảm được bao nhiêu phần trăm
          discountAmount: voucherDiscount, // giảm được bao nhiêu tiền từ phần trăm
        };
      } catch (error) {
        // Nếu lỗi, không áp dụng voucher và tiếp tục tạo đơn hàng
        console.error("Lỗi áp dụng voucher:", error);
      }
    }

    // Tạo mã đơn hàng
    const orderCode = generateOrderCode();

    // Tạo đơn hàng
    const order = new Order({
      userId,
      items: orderItems,
      voucherDiscount: voucherDiscount,
      totalAmount: totalAmount,
      voucherId: voucherInfo,
      addressId,
      shippingAddress: {
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        province: address.province,
        district: address.district,
        ward: address.ward,
        address: address.address,
      },
      orderCode,
      status: "pending",
      paymentMethod: "COD",
    });
  console.log(order)
    // Lưu đơn hàng và xóa giỏ hàng
    const savedOrder = await order.save();
    await Cart.findOneAndDelete({ userId });

    return savedOrder;
  } catch (error) {
    throw error;
  }
};

// Hàm tạo mã đơn hàng
const generateOrderCode = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};
