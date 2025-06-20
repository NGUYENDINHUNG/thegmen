import Order from "#models/orderModel.Schema.js";
import Cart from "#models/cartModel.schema.js";
import Address from "#models/addressModel.schema.js";
import User from "#models/userModel.schema.js";
import Variants from "#models/variantsModel.schema.js";
import { addToCartService, calculateCartTotals } from "#services/cartService.js";
import {
  sendOrderCancellationEmail,
  sendOrderConfirmationEmail,
} from "#constants/emailConstants.js";

const generateOrderCode = () => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${random}`;
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
export const removeOrderService = async (orderId, userId) => {
  try {
    // Tìm và populate thông tin user ngay từ đầu
    const order = await Order.findById(orderId)
      .populate("userId", "email name")
      .populate({
        path: "items.productId",
        select: "name price finalPrice avatar",
      })
      .populate({
        path: "items.variantId",
        select: "color size",
      });

    if (!order) {
      throw new Error("Đơn hàng không tồn tại");
    }

    if (order.status !== "pending") {
      throw new Error("Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý");
    }

    // Kiểm tra user
    const user = await User.findById(userId);
    if (!user || !user.email) {
      throw new Error("Không tìm thấy thông tin người dùng hoặc email");
    }

    // Xử lý hoàn trả số lượng sản phẩm
    for (const item of order.items) {
      if (item.variantId) {
        await Variants.findByIdAndUpdate(item.variantId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Cập nhật trạng thái đơn hàng
    order.status = "cancelled";
    await order.save();

    // Gửi email với xử lý lỗi
    try {
      const emailSent = await sendOrderCancellationEmail(order);
      if (!emailSent) {
        console.log(`Failed to send cancellation email for order ${orderId}`);
      }
    } catch (emailError) {
      console.error("Error sending cancellation email:", emailError);
      // Không throw error ở đây để không ảnh hưởng đến việc hủy đơn hàng
    }

    return {
      success: true,
      message: "Hủy đơn hàng thành công",
    };
  } catch (error) {
    console.error("Error in removeOrderService:", error);
    throw new Error(error.message || "Hủy đơn hàng thất bại");
  }
};
export const getOrdersByUserService = async (userId) => {
  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        select: "name images ",
      })
      .populate({
        path: "items.variantId",
        select: "color size images",
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
      address: order.shippingAddress.address,
      status: order.status,
      paymentMethod: order.paymentMethod,
      finalAmount: order.totalAmount,
      discountAmount: order.voucherDiscount,
      originalTotal: order.originalTotal,
      orderCode: order.orderCode,
      createdAt: order.createdAt,
      totalItems: order.items.reduce((total, item) => total + item.quantity, 0),
      items: order.items.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        variant: item.variantId
          ? {
              color: item.variantId.color,
              size: item.variantId.size,
            }
          : null,
      })),
    }));

    return formattedOrders;
  } catch (error) {
    throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
  }
};
export const getDetailOrderService = async (orderId) => {
  try {
    // Thêm populate cho variantId
    const order = await Order.findById(orderId).populate([
      {
        path: "items.productId",
        select: "name images slug",
      },
      {
        path: "items.variantId",
        select: "color size images",
      },
    ]);

    if (!order) {
      return {
        status: 404,
        message: "Không tìm thấy đơn hàng",
        data: null,
      };
    }

    // Tính lại originalTotal từ danh sách sản phẩm
    const originalTotal = order.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    const discountAmount = order.voucherDiscount || 0;
    const finalAmount = order.totalAmount || originalTotal;

    return {
      _id: order._id,
      status: order.status,
      orderCode: order.orderCode,
      createdAt: order.createdAt,
      address: order.shippingAddress.address,
      paymentMethod: order.paymentMethod,
      totalItems: order.items.reduce((total, item) => total + item.quantity, 0),
      originalTotal,
      discountAmount,
      finalAmount,
      items: order.items.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
        // Lấy thông tin variant từ variantId đã populate
        variant: item.variantId
          ? {
              color: item.variantId.color,
              size: item.variantId.size,
            }
          : null,
      })),
    };
  } catch (error) {
    console.error("Error in getDetailOrderService:", error);
    throw new Error(`Lỗi khi lấy thông tin đơn hàng: ${error.message}`);
  }
};
export const createOrderService = async (userId, addressId) => {
  try {
    // 1. Kiểm tra địa chỉ
    const address = await Address.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    // 2. Lấy thông tin người dùng
    const user = await User.findById(userId);
    if (!user || !user.email) {
      throw new Error("Không tìm thấy thông tin người dùng hoặc email");
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

    // Lọc ra các sản phẩm được chọn
    const selectedItems = cart.items.filter((item) => item.selected === true);

    if (selectedItems.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một sản phẩm để đặt hàng");
    }

    // 3. Kiểm tra số lượng sản phẩm trong kho
    for (const item of selectedItems) {
      if (item.variantId) {
        const variant = item.variantId;
        if (variant.stock < item.quantity) {
          throw new Error(
            `Sản phẩm ${item.productId.name} không đủ số lượng trong kho`
          );
        }
      }
    }

    // 4. Tính toán giá trị đơn hàng sử dụng calculateCartTotals
    const totals = calculateCartTotals(cart);

    // 5. Tạo danh sách sản phẩm cho đơn hàng
    const orderItems = selectedItems.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId?._id,
      quantity: item.quantity,
      price: item.productId.finalPrice ?? item.productId.price,
      name: item.productId.name,
      image: item.productId.avatar,
      variant: item.variantId
        ? {
            color: item.variantId.color,
            size: item.variantId.size,
          }
        : null,
    }));

    // 6. Tạo mã đơn hàng
    const orderCode = generateOrderCode();

    // 7. Tạo đơn hàng mới
    const order = new Order({
      userId,
      items: orderItems,
      originalTotal: totals.totalPrice,
      totalAmount: totals.finalAmount,
      voucherDiscount: totals.discountAmount,
      voucherInfo: totals.voucherInfo
        ? {
            id: totals.voucherInfo.voucherId,
            code: totals.voucherInfo.code,
            discountValue: totals.voucherInfo.discountValue,
            discountAmount: totals.discountAmount,
          }
        : null,
      shippingAddress: {
        address: address.address,
      },
      orderCode,
      status: "pending",
      paymentMethod: "COD",
    });

    // 8. Lưu đơn hàng
    const savedOrder = await order.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("userId", "email name")
      .populate({
        path: "items.productId",
        select: "name price finalPrice avatar",
      })
      .populate({
        path: "items.variantId",
        select: "color size",
      });
    // 9. Cập nhật số lượng sản phẩm trong kho
    for (const item of selectedItems) {
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

    // 11. Xóa các sản phẩm đã đặt hàng khỏi giỏ hàng
    cart.items = cart.items.filter((item) => !item.selected);
    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ userId });
    } else {
      await cart.save();
    }
    await sendOrderConfirmationEmail(populatedOrder);
    return savedOrder;
  } catch (error) {
    console.log("Lỗi tạo đơn hàng:", error);
    throw error;
  }
};
export const buyNowService = async (userId, productId, variantId, quantity) => {
  try {
    // 1. Thêm sản phẩm vào giỏ hàng
    const addToCartResult = await addToCartService(
      userId,
      productId,
      variantId,
      quantity
    );

    if (addToCartResult.EC !== 0) {
      return {
        EC: addToCartResult.EC,
        EM: addToCartResult.EM,
      };
    }

    const cart = addToCartResult.DT;

    // 2. Bỏ chọn tất cả các sản phẩm trong giỏ hàng
    cart.items.forEach((item) => {
      item.selected = false;
    });

    // 3. Chỉ chọn sản phẩm vừa thêm vào
    const newItemIndex = cart.items.findIndex((item) => {
      if (variantId) {
        return (
          item.productId.toString() === productId &&
          item.variantId &&
          item.variantId.toString() === variantId
        );
      } else {
        return (
          item.productId.toString() === productId &&
          (!item.variantId || item.variantId === null)
        );
      }
    });

    if (newItemIndex > -1) {
      cart.items[newItemIndex].selected = true;
    }

    // 4. Tính lại tổng tiền chỉ cho sản phẩm được chọn
    let totalPrice = 0;
    cart.items.forEach((item) => {
      if (item.selected) {
        const price = item.productId.finalPrice ?? item.productId.price ?? 0;
        totalPrice += price * item.quantity;
      }
    });

    cart.finalAmount = totalPrice;
    await cart.save();

    return {
      EC: 0,
      EM: "Mua ngay thành công",
      DT: cart,
    };
  } catch (error) {
    console.log("Error in buyNowService:", error);
    return {
      EC: 500,
      EM: error.message || "Lỗi server khi thực hiện mua ngay",
    };
  }
};
