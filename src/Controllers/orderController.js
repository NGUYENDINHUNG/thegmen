import {
  buyNowService,
  createOrderService,
  getDetailOrderService,
  getOrdersByUserService,
  getOrdersByUserServiceDetail,
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
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await getOrdersByUserServiceDetail(userId);

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

    const cart = await buyNowService(userId, productId, variantId, quantity);

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
