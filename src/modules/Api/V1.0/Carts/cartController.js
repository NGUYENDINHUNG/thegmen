import {
  addToCartService,
  getCartByUserService,
  removeItemFromCartService,
} from "./CartService.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const cart = await addToCartService(userId, productId, variantId, quantity);

    return res.status(200).json({
      message: "Thêm sản phẩm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Lỗi khi thêm sản phẩm vào giỏ hàng",
    });
  }
};
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await getCartByUserService(userId);

    if (!cart) {
      return res.status(404).json({
        message: "Không tìm thấy giỏ hàng",
      });
    }

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Lỗi khi lấy giỏ hàng",
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
        message: "Không tìm thấy giỏ hàng hoặc sản phẩm",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
    });
  }
};
