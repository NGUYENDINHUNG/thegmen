import {
  addToCartService,
  getCartByUserService,
  removeItemFromCartService,
  updateCartItemService,
  updateItemSelectionService,
} from "../services/cartService.js";

export const calculateCartTotals = (cart) => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let selectedItemsCount = 0;
  let selectedItems = [];

  // Tính tổng giá và số lượng cho các sản phẩm được chọn
  cart.items.forEach((item) => {
    if (item.selected) {
      const price =
        item.productId?.finalPrice && item.productId.finalPrice > 0
          ? item.productId.finalPrice
          : item.productId?.price ?? 0;

      const quantity = item.quantity ?? 0;
      totalPrice += price * quantity;
      totalQuantity += quantity;
      selectedItemsCount++;
      selectedItems.push(item);
    }
  });

  // Tính toán giá sau khi áp dụng voucher
  let discountAmount = 0;
  let finalAmount = totalPrice;

  if (cart.appliedVoucher?.voucherId) {
    const voucher = cart.appliedVoucher.voucherId;
    discountAmount = (totalPrice * voucher.discountValue) / 100;
    finalAmount = totalPrice - discountAmount;
  }

  return {
    totalPrice,
    totalQuantity,
    selectedItemsCount,
    selectedItems,
    discountAmount,
    finalAmount,
    voucherInfo: cart.appliedVoucher?.voucherId
      ? {
          voucherId: cart.appliedVoucher.voucherId._id,
          code: cart.appliedVoucher.code,
          discountValue: cart.appliedVoucher.discountValue,
        }
      : null,
  };
};

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
    const result = await updateCartItemService(
      userId,
      productId,
      variantId,
      quantity
    );

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
export const updateItemSelection = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, selected } = req.body;

    const result = await updateItemSelectionService(userId, itemId, selected);

    return res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái chọn sản phẩm thành công",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Cập nhật trạng thái chọn sản phẩm thất bại",
      error: error.message,
    });
  }
};
