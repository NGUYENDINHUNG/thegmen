import Order from "#models/orderModel.Schema.js";
import {
  buyNowService,
  createOrderService,
  getDetailOrderService,
  getOrdersByUserService,
  removeOrderService,
  UpdateOrderService,
} from "#services/ordersService.js";

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
export const removeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý",
      });
    }
    const result = await removeOrderService(orderId, userId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.log("Error in cancelOrder:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Hủy đơn hàng thất bại",
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
export const getListOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getOrdersByUserService(userId);
    return res.status(200).json({
      status: 200,
      message: "Lấy danh sách đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDetailOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await getDetailOrderService(orderId);
    return res.status(200).json({
      status: 200,
      message: "Lấy chi tiết đơn hàng thành công",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const buyNow = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;

    const result = await buyNowService(userId, productId, variantId, quantity);
    
    if (result.EC !== 0) {
      return res.status(403).json({
        statusCode: result.EC,
        message: result.EM,
      });
    }

    // ✅ Kiểm tra result.DT và result.DT.items trước khi sử dụng
    const cart = result.DT;
    if (!cart || !cart.items) {
      return res.status(500).json({
        statusCode: 500,
        message: "Dữ liệu giỏ hàng không hợp lệ",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      cart,
      selectedItems: cart.items.filter((item) => item.selected),
      totalAmount: cart.finalAmount,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Thêm sản phẩm vào giỏ hàng thất bại",
      error: error.message,
    });
  }
};
