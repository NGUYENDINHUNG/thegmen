import Order from "../model/orderModel.Schema.js";
import Cart from "../model/cartModel.schema.js";
import Address from "../model/addressModel.schema.js";
import User from "../model/userModel.schema.js";
import { validateAndApplyVoucherService } from "./vouchersSevice.js";

const generateOrderCode = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

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
    let originalTotal = 0;

    cart.items.forEach((item) => {
      const product = item.productId;
      const itemPrice = product.price * item.quantity;
      originalTotal += itemPrice;

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
    let totalAmount = originalTotal;

    if (voucherCode) {
      try {
        const result = await validateAndApplyVoucherService(
          voucherCode,
          originalTotal,
          userId
        );
        voucherDiscount = result.discountAmount;
        totalAmount = result.finalAmount;
        voucherInfo = {
          id: result.voucher._id,
          code: result.voucher.code,
          discountType: result.voucher.discountType,
          discountValue: result.voucher.discountValue,
          discountAmount: voucherDiscount,
        };
      } catch (error) {
        console.error("Lỗi áp dụng voucher:", error);
      }
    }

    const orderCode = generateOrderCode();

    const order = new Order({
      userId,
      items: orderItems,
      originalTotal,
      totalAmount,
      voucherDiscount,
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

    const savedOrder = await order.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { order: savedOrder._id } },
      { new: true }
    );
    await Cart.findOneAndDelete({ userId });

    return savedOrder;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByUserService = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        select: "name images description",
      });

    if (!orders) {
      return {
        status: 400,
        message: "Không có đơn hàng nào",
        data: [],
      };
    }

    return {
      status: 200,
      message: "Lấy danh sách đơn hàng thành công",
      data: orders,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
  }
};
