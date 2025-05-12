import { createOrderService } from "../service/ordersService.js";

export const createOrder = async (req, res) => {
  try {
   
    const { addressId, voucherCode, paymentMethod = "COD" } = req.body;
    const userId = req.user._id;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn địa chỉ giao hàng",
      });
    }

    const order = await createOrderService(userId, addressId, voucherCode);
    return res.status(200).json({
      success: true,
      message: "Đặt hàng thành công",
      data: {
        orderId: order._id,
        orderCode: order.orderCode,
        totalAmount: order.totalAmount,
        orderDate: order.createdAt,
        status: order.status,
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
