import {
  buyNowService,
  createOrderService,
  getOrdersByUserService,
  removeOrderService,
  UpdateOrderService,
} from "../services/ordersService.js";

export const createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;
    const userId = req.user._id;

    const result = await createOrderService(userId, addressId);

    return res.status(200).json({
      status: 200,
      message: "Tạo đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể tạo đơn hàng",
    });
  }
};
export const byNowOrder = async (req, res) => {
  try {
    const { addressId, productId, variantId, quantity, voucherCode } = req.body;
    const userId = req.user._id;
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn địa chỉ giao hàng",
      });
    }

    const order = await buyNowService(
      userId,
      addressId,
      productId,
      variantId,
      quantity,
      voucherCode
    );

    return res.status(200).json({
      status: 200,
      message: "Đặt hàng thành công",
      data: {
        orderId: order._id,
        orderCode: order.orderCode,
        status: order.status,
        orderDate: order.createdAt,
        paymentMethod: order.paymentMethod,
        originalTotal: order.originalTotal,
        totalAmount: order.totalAmount,
        voucherDiscount: order.voucherDiscount,
        voucher: order.voucherId || null,
        items: order.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        })),
        shippingAddress: order.shippingAddress,
      },
    });
  } catch (error) {
    if (error.message.includes("Địa chỉ không tồn tại")) {
      return res.status(404).json({
        success: false,
        message: "Địa chỉ giao hàng không tồn tại",
        error: error.message,
      });
    }

    if (error.message.includes("Giỏ hàng trống")) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng của bạn đang trống",
        error: error.message,
      });
    }

    if (error.message.includes("Lỗi áp dụng voucher")) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: error.message,
      });
    }

    console.error("Lỗi tạo đơn hàng:", error);
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi tạo đơn hàng",
      error: error.message,
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getOrdersByUserService(userId);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const removeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await removeOrderService(orderId);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Đơn hàng đã được hủy bỏ thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const result = await UpdateOrderService(orderId, status);
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Đơn hàng đã được cập nhật thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
