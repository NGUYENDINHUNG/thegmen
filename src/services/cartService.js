import Cart from "../models/cartModel.schema.js";
import Variants from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";
import { validateAndApplyVoucherForCartService } from "./vouchersSevice.js";

export const addToCartService = async (
  userId,
  productId,
  variantId,
  quantity
) => {
  try {
    quantity = Number(quantity);

    let stock = 0;
    if (variantId) {
      const variant = await Variants.findById(variantId);
      if (!variant) throw new Error("Biến thể không tồn tại");
      if (variant.Products.toString() !== productId) {
        throw new Error("Biến thể không thuộc sản phẩm này");
      }
      stock = variant.stock;
    } else {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Sản phẩm không tồn tại");
      stock = product.stock;
    }

    if (quantity <= 0) {
      throw new Error("Số lượng sản phẩm phải lớn hơn 0");
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    const itemIndex = cart.items.findIndex((item) => {
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

    let currentQuantity = 0;
    if (itemIndex > -1) {
      currentQuantity = Number(cart.items[itemIndex].quantity);
    }
    if (currentQuantity + quantity > stock) {
      throw new Error(
        `Tổng số lượng trong giỏ hàng không được vượt quá ${stock} sản phẩm`
      );
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = currentQuantity + quantity;
    } else {
      cart.items.push({ productId, variantId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Thêm sản phẩm vào giỏ hàng thất bại: ${error.message}`);
  }
};
export const getCartByUserService = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate([
    {
      path: "items.productId",
      select: "_id name finalPrice price avatar discount slug",
    },
    {
      path: "items.variantId",
      select: "_id color size sku images",
    },
    {
      path: "appliedVoucher.voucherId",
      select: "_id code name discountValue",
    },
  ]);

  if (!cart) return null;

  let totalQuantity = 0;
  let totalPrice = 0;

  cart.items.forEach((item) => {
    const product = item.productId;
    if (product) {
      const price = product.finalPrice ?? product.price ?? 0;
      totalQuantity += item.quantity;
      totalPrice += price * item.quantity;
    }
  });

  let discountAmount = 0;
  let voucherInfo = null;

  if (cart.appliedVoucher?.voucherId) {
    const finalAmount = cart.finalAmount ?? totalPrice;
    discountAmount = totalPrice - finalAmount;
    voucherInfo = {
      voucherId: cart.appliedVoucher.voucherId._id,
      code: cart.appliedVoucher.code,
      discountValue: cart.appliedVoucher.discountValue,
    };
  }

  return {
    cart,
    totalQuantity,
    item: cart.items.length,
    totalPrice,
    discountAmount,
    finalAmount: cart.finalAmount || totalPrice,
    voucherInfo,
  };
};

export const removeItemFromCartService = async (
  userId,
  productId,
  variantId
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  // Tìm index của item cần xóa
  const itemIndex = cart.items.findIndex((item) => {
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

  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = new Date();
    await cart.save();
  }

  return cart;
};

export const updateCartItemService = async (
  userId,
  productId,
  variantId,
  quantity
) => {
  try {
    const newQuantity = Number(quantity);
    if (isNaN(newQuantity)) throw new Error("Số lượng không hợp lệ");

    let cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount slug",
      },
      {
        path: "items.variantId",
        select: "_id color size sku images",
      },
      {
        path: "appliedVoucher.voucherId",
        select: "_id code name discountValue",
      },
    ]);

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng của người dùng");
    }

    const itemIndex = cart.items.findIndex((item) => {
      const itemProductId =
        item.productId?._id?.toString?.() ?? item.productId?.toString();
      const itemVariantId =
        item.variantId?._id?.toString?.() ?? item.variantId?.toString();
      const prodMatch = itemProductId === productId.toString();
      const variantMatch = variantId
        ? itemVariantId === variantId.toString()
        : !itemVariantId;
      return prodMatch && variantMatch;
    });

    if (itemIndex === -1) {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    if (newQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }

    let totalPrice = 0;
    cart.items.forEach((item) => {
      const price =
        item.productId.finalPrice && item.productId.finalPrice > 0
          ? item.productId.finalPrice
          : item.productId.price ?? 0;
      totalPrice += price * item.quantity;
    });

    let discountAmount = 0;
    let finalAmount = totalPrice;

    if (cart.appliedVoucher?.code) {
      const voucherResult = await validateAndApplyVoucherForCartService(
        cart.appliedVoucher.code,
        totalPrice,
        userId,
        true
      );
      discountAmount = voucherResult.discountAmount;
      finalAmount = voucherResult.finalAmount;
    }

    cart.finalAmount = finalAmount;
    cart.updatedAt = new Date();
    await cart.save();

    return {
      cart,
      totalPrice,
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    throw new Error(`Cập nhật giỏ hàng thất bại: ${error.message}`);
  }
};

