import Order from "../models/orderModel.Schema.js";
import Cart from "../models/cartModel.schema.js";
import Address from "../models/addressModel.schema.js";
import User from "../models/userModel.schema.js";
import { validateAndApplyVoucherService } from "./vouchersSevice.js";
import Variants from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";

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
    for (const item of cart.items) {
      if (item.variantId) {
        const variant = await Variants.findById(item.variantId);
        if (!variant) {
          throw new Error(`Biến thể sản phẩm không tồn tại`);
        }
        if (variant.stock < item.quantity) {
          throw new Error(
            `Sản phẩm ${item.productId.name} không đủ số lượng trong kho`
          );
        }
      }
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
    //vouchers
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
    //create code order
    const orderCode = generateOrderCode();
    //create order
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
    //save order
    const savedOrder = await order.save();
    //update stock variant
    for (const item of cart.items) {
      if (item.variantId) {
        await Variants.findByIdAndUpdate(item.variantId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    await User.findByIdAndUpdate(
      userId,
      { $push: { order: savedOrder._id } },
      { new: true }
    );
    await Cart.findOneAndDelete({ userId });
    return savedOrder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const buyNowService = async (
  userId,
  addressId,
  productId,
  variantId,
  quantity,
  voucherCode
) => {
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }
    if (variantId) {
      const variant = await Variants.findById(variantId);
      if (!variant) {
        throw new Error("Biến thể sản phẩm không tồn tại");
      }
      if (variant.stock < quantity) {
        throw new Error("Số lượng sản phẩm không đủ");
      }
    }
    const orderItems = [
      {
        productId: product._id,
        variantId: variantId || null,
        quantity: quantity,
        price: product.price,
        name: product.name,
      },
    ];

    const originalTotal = product.price * quantity;
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

    // Cập nhật số lượng tồn kho
    if (variantId) {
      await Variants.findByIdAndUpdate(variantId, {
        $inc: { stock: -quantity },
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $push: { order: savedOrder._id } },
      { new: true }
    );

    return savedOrder;
  } catch (error) {
    console.log(error);
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

export const UpdateOrderService = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return {
    success: true,
    message: "Cập nhật trạng thái đơn hàng thành công",
    data: order,
  };
};

export const removeOrderService = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Đơn hàng không tồn tại");
  }
  for (const item of order.items) {
    if (item.variantId) {
      await Variants.findByIdAndUpdate(item.variantId, {
        $inc: { stock: item.quantity },
      });
    }
  }
  await Order.findByIdAndDelete(orderId);

  return {
    success: true,
    message: "Hủy đơn hàng thành công ",
  };
};
