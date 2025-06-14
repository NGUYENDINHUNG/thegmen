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
    const cart = await getCartByUserService(userId);

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
    console.log(req.body);
    const result = await updateCartItemService(userId, productId, variantId, quantity);
   
    return res.status(200).json({
      status: 200,
      message: "Cập nhật giỏ hàng thành công",
      data: {
        cart: result.cart,
        totalPrice: result.totalPrice,
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message || "Cập nhật giỏ hàng thất bại",
    });
  }
};
