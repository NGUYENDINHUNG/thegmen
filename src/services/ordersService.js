import Order from "../models/orderModel.Schema.js";
import Cart from "../models/cartModel.schema.js";
import Address from "../models/addressModel.schema.js";
import User from "../models/userModel.schema.js";
import Variants from "../models/variantsModel.schema.js";
// import Product from "../models/productModel.schema.js";

const generateOrderCode = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${random}`;
};

export const createOrderService = async (userId, addressId) => {
  try {
    // 1. Kiểm tra địa chỉ
    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }

    // 2. Lấy thông tin giỏ hàng
    const cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount slug",
      },
      {
        path: "items.variantId",
        select: "_id color size sku images stock",
      },
      {
        path: "appliedVoucher.voucherId",
        select: "_id code name discountValue",
      },
    ]);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    // 3. Kiểm tra số lượng sản phẩm trong kho
    for (const item of cart.items) {
      if (item.variantId) {
        const variant = item.variantId; // Đã được populate
        if (variant.stock < item.quantity) {
          throw new Error(
            `Sản phẩm ${item.productId.name} không đủ số lượng trong kho`
          );
        }
      }
    }

    // 4. Tính toán giá trị đơn hàng
    const orderItems = [];
    let originalTotal = 0;

    cart.items.forEach((item) => {
      const product = item.productId;
      // Sử dụng finalPrice nếu có, nếu không thì dùng price
      const itemPrice = (product.finalPrice ?? product.price) * item.quantity;
      originalTotal += itemPrice;

      orderItems.push({
        productId: product._id,
        variantId: item.variantId?._id,
        quantity: item.quantity,
        price: product.finalPrice ?? product.price,
        name: product.name,
        image: product.avatar,
        variant: item.variantId
          ? {
              color: item.variantId.color,
              size: item.variantId.size,
            }
          : null,
      });
    });

    // 5. Xử lý voucher
    let voucherDiscount = 0;
    let voucherInfo = null;
    let totalAmount = originalTotal;

    if (cart.appliedVoucher?.voucherId) {
      const voucher = cart.appliedVoucher.voucherId;
      voucherDiscount = (originalTotal * voucher.discountValue) / 100;
      totalAmount = originalTotal - voucherDiscount;
      voucherInfo = {
        id: voucher._id,
        code: voucher.code,
        discountValue: voucher.discountValue,
        discountAmount: voucherDiscount,
      };
    }

    // 6. Tạo mã đơn hàng
    const orderCode = generateOrderCode();

    // 7. Tạo đơn hàng mới
    const order = new Order({
      userId,
      items: orderItems,
      originalTotal,
      totalAmount,
      voucherDiscount,
      voucherInfo,
      shippingAddress: {
        address: address.address,
      },
      orderCode,
      status: "pending",
      paymentMethod: "COD",
    });

    // 8. Lưu đơn hàng
    const savedOrder = await order.save();

    // 9. Cập nhật số lượng sản phẩm trong kho
    for (const item of cart.items) {
      if (item.variantId) {
        await Variants.findByIdAndUpdate(item.variantId._id, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    // 10. Cập nhật thông tin người dùng
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    // 11. Xóa giỏ hàng
    await Cart.findOneAndDelete({ userId });

    return {
      order: savedOrder,
      totalAmount,
      voucherDiscount,
      originalTotal,
    };
  } catch (error) {
    console.log("Lỗi tạo đơn hàng:", error);
    throw error;
  }
};

// export const buyNowService = async (
//   userId,
//   addressId,
//   productId,
//   variantId,
//   quantity,
//   voucherCode
// ) => {
//   try {
//     const address = await Address.findById(addressId);
//     if (!address) {
//       throw new Error("Địa chỉ không tồn tại");
//     }
//     const product = await Product.findById(productId);
//     if (!product) {
//       throw new Error("Sản phẩm không tồn tại");
//     }
//     if (variantId) {
//       const variant = await Variants.findById(variantId);
//       if (!variant) {
//         throw new Error("Biến thể sản phẩm không tồn tại");
//       }
//       if (variant.stock < quantity) {
//         throw new Error("Số lượng sản phẩm không đủ");
//       }
//     }
//     const orderItems = [
//       {
//         productId: product._id,
//         variantId: variantId || null,
//         quantity: quantity,
//         price: product.price,
//         name: product.name,
//       },
//     ];

//     const originalTotal = product.price * quantity;
//     let voucherDiscount = 0;
//     let voucherInfo = null;
//     let totalAmount = originalTotal;

//     if (voucherCode) {
//       try {
//         const result = await validateAndApplyVoucherService(
//           voucherCode,
//           originalTotal,
//           userId
//         );
//         voucherDiscount = result.discountAmount;
//         totalAmount = result.finalAmount;
//         voucherInfo = {
//           id: result.voucher._id,
//           code: result.voucher.code,
//           discountType: result.voucher.discountType,
//           discountValue: result.voucher.discountValue,
//           discountAmount: voucherDiscount,
//         };
//       } catch (error) {
//         console.error("Lỗi áp dụng voucher:", error);
//       }
//     }

//     const orderCode = generateOrderCode();

//     const order = new Order({
//       userId,
//       items: orderItems,
//       originalTotal,
//       totalAmount,
//       voucherDiscount,
//       voucherId: voucherInfo,
//       addressId,
//       shippingAddress: {
//         fullName: address.fullName,
//         phoneNumber: address.phoneNumber,
//         province: address.province,
//         district: address.district,
//         ward: address.ward,
//         address: address.address,
//       },
//       orderCode,
//       status: "pending",
//       paymentMethod: "COD",
//     });

//     const savedOrder = await order.save();

//     // Cập nhật số lượng tồn kho
//     if (variantId) {
//       await Variants.findByIdAndUpdate(variantId, {
//         $inc: { stock: -quantity },
//       });
//     }

//     await User.findByIdAndUpdate(
//       userId,
//       { $push: { order: savedOrder._id } },
//       { new: true }
//     );

//     return savedOrder;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
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
export const getOrdersByUserServiceDetail = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        select: "name images ",
      });

    if (!orders) {
      return {
        status: 400,
        message: "Không có đơn hàng nào",
        data: [],
      };
    }

    // Format lại dữ liệu trả về
    const formattedOrders = orders.map((order) => ({
      address: order.shippingAddress.address,
      status: order.status,
      paymentMethod: order.paymentMethod,
      originalTotal: order.originalTotal,
      totalAmount: order.totalAmount,
      discount: order.voucherDiscount,
      orderCode: order.orderCode,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
      })),
    }));

    return {
      status: 200,
      message: "Lấy danh sách đơn hàng thành công",
      data: formattedOrders,
    };
  } catch (error) {
    throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
  }
};
export const getOrdersByUserService = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        select: "name images ",
      });

    if (!orders) {
      return {
        status: 400,
        message: "Không có đơn hàng nào",
        data: [],
      };
    }

    // Format lại dữ liệu trả về
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      totalItems: order.items.length,
      orderCode: order.orderCode,
      createdAt: order.createdAt,
    }));

    return formattedOrders;
  } catch (error) {
    throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
  }
};
export const getDetailOrderService = async (orderId) => {
  try {
    // Tìm đơn hàng theo ID
    const order = await Order.findById(orderId).populate({
      path: "items.productId",
      select: "name images ",
    });

    // Kiểm tra nếu không tìm thấy đơn hàng
    if (!order) {
      return {
        status: 404,
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    // Format dữ liệu trả về
    const formattedOrder = {
      _id: order._id,
      status: order.status,
      totalAmount: order.totalAmount,
      totalItems: order.items.reduce((total, item) => total + item.quantity, 0),
      orderCode: order.orderCode,
      createdAt: order.createdAt,
      address: order.shippingAddress.address,
      paymentMethod: order.paymentMethod,
      originalTotal: order.originalTotal,
      discount: order.voucherDiscount,
      items: order.items.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    return  formattedOrder;
  } catch (error) {
    console.error("Error in getDetailOrderService:", error);
    throw new Error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
  }
};
