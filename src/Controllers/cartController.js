import {
  addToCartService,
  getCartByUserService,
  removeItemFromCartService,
  updateCartItemService,
} from "../services/cartService.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const cart = await addToCartService(userId, productId, variantId, quantity);

    return res.status(200).json({
      statusCode: 200,
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "thêm sản phẩm vào giỏ hàng thất bại",
      error: error.message,
    });
  }
};
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { voucherCode } = req.body;
    const cart = await getCartByUserService(userId, voucherCode);

    if (!cart) {
      return res.status(404).json({
        statusCode: 404,
        message: "Không tìm thấy giỏ hàng",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi khi lấy giỏ hàng",
      error: error.message,
    });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId } = req.body;

    const cart = await removeItemFromCartService(userId, productId, variantId);

    if (!cart) {
      return res.status(404).json({
        statusCode: 404,
        message: "Không tìm thấy giỏ hàng hoặc sản phẩm",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;

    const cart = await updateCartItemService(
      userId,
      productId,
      variantId,
      quantity
    );

    return res.status(200).json({
      statusCode: 200,
      message: "cập nhật giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "cập nhật giỏ hàng thất bại",
      error: error.message,
    });
  }
};
