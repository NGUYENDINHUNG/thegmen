import {
  addToCartService,
  getCartByUserService,
  removeItemFromCartService,
  updateCartItemService,
  updateItemSelectionService,
} from "../services/cartService.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantId, quantity } = req.body;
    const cart = await addToCartService(userId, productId, variantId, quantity);

    if (cart.EC !== 0) {
      return res.status(cart.EC).json({
        statusCode: cart.EC,
        message: cart.EM,
      });
    }

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

    if (cart.item === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Giỏ hàng trống",
        data: cart,
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message:  "Lấy giỏ hàng thành công",
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
    const result = await updateCartItemService(
      userId,
      productId,
      variantId,
      quantity
    );

    if (result.EC !== 0) {
      return res.status(result.EC).json({
        statusCode: result.EC,
        message: result.EM,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật sản phẩm thành công",
      data: result.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi server khi cập nhật sản phẩm",
      error: error.message,
    });
  }
};
export const updateItemSelection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, selected } = req.body;

    const result = await updateItemSelectionService(userId, itemId, selected);

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật trạng thái chọn sản phẩm thành công",
      data: result,
    });
  } catch (error) {
    console.log("Error in updateItemSelection:", error);
    return res.status(200).json({
      statusCode: 500,
      message: "Lỗi server khi cập nhật trạng thái sản phẩm",
    });
  }
};
