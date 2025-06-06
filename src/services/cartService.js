import Cart from "../models/cartModel.schema.js";
import Variants from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";

export const addToCartService = async (
  userId,
  productId,
  variantId,
  quantity
) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
    });
  }
  // Kiểm tra tồn kho
  let stock = 0;
  if (variantId) {
    const variant = await Variants.findById(variantId);
    if (!variant) throw new Error("Biến thể không tồn tại");
    stock = variant.stock;
  } else {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Sản phẩm không tồn tại");
    stock = product.stock;
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
    currentQuantity = cart.items[itemIndex].quantity;
  }

  if (currentQuantity + quantity > stock) {
    throw new Error("Số lượng vượt quá tồn kho");
  }
  console.log(currentQuantity + quantity);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, variantId, quantity });
  }

  cart.updatedAt = new Date();
  await cart.save();
  return cart;
};

export const getCartByUserService = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate([
    {
      path: "items.productId",
      select:
        "-featured -categories -sizeSuggestCategories -isDeleted -deletedAt -createdAt -updatedAt -__v -stock -description -images",
    },
    {
      path: "items.variantId",
      select: "-isDeleted -deletedAt -createdAt -updatedAt -__v -stock",
    },
  ]);
  if (!cart) return null;

  let totalQuantity = 0;
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalQuantity += item.quantity;
    if (item.productId) {
      const price = item.productId.finalPrice || item.productId.price;
      if (price) {
        totalPrice += price * item.quantity;
      }
    }
  });
  console.log(totalPrice);
  return {
    cart,
    totalQuantity,
    totalPrice,
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
