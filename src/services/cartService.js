import Cart from "../models/cartModel.schema.js";
import Variants from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";

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
      select:
        "-featured -categories -isDeleted -deletedAt -createdAt -updatedAt -__v -stock -description",
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
      const finalPrice = item.productId.finalPrice;
      const basePrice = item.productId.price;
      const price =
        finalPrice !== undefined && finalPrice !== null
          ? finalPrice
          : basePrice;
      if (price) {
        totalPrice += price * item.quantity;
      }
    }
  });

  if (!cart.finalAmount) {
    cart.finalAmount = totalPrice;
    await cart.save();
  }


  return {
    cart,
    totalQuantity,
    totalPrice,
    finalAmount: cart.finalAmount,
    item: cart.items.length
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
    quantity = Number(quantity);

    let cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Giỏ hàng không tồn tại");

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

    if (itemIndex === -1) {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    if (quantity <= 0) {
      // Xóa item nếu quantity <= 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Cập nhật số lượng mới
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = new Date();
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(`Cập nhật giỏ hàng thất bại: ${error.message}`);
  }
};

// const fetchUserCart = async (userId) => {
//   return await Cart.findOne({ userId }).populate([
//     {
//       path: "items.productId",
//       select:
//         "-featured -categories -isDeleted -deletedAt -createdAt -updatedAt -__v -stock -description",
//     },
//     {
//       path: "items.variantId",
//       select: "-isDeleted -deletedAt -createdAt -updatedAt -__v -stock",
//     },
//   ]);
// };

// const calculateCartTotals = (items) => {
//   let totalQuantity = 0;
//   let totalPrice = 0;

//   for (const item of items) {
//     if (!item.productId || item.productId.isDeleted) continue;

//     const price =
//       item.variantId?.price ??
//       item.productId.finalPrice ??
//       item.productId.price;

//     if (!price) continue;

//     totalQuantity += item.quantity;
//     totalPrice += price * item.quantity;
//   }

//   return { totalQuantity, totalPrice };
// };

// const tryApplyVoucher = async (voucherCode, totalPrice, userId) => {
//   if (!voucherCode) {
//     return { discountAmount: 0, voucher: null, error: null };
//   }

//   try {
//     const result = await validateAndApplyVoucherService(
//       voucherCode,
//       totalPrice,
//       userId
//     );
//     return {
//       discountAmount: result.discountAmount,
//       voucher: result.voucher,
//       error: null,
//     };
//   } catch (err) {
//     return { discountAmount: 0, voucher: null, error: err.message };
//   }
// };

// const formatCartResponse = (
//   cart,
//   totalQuantity,
//   totalPrice,
//   voucherResult,
//   finalAmount
// ) => {
//   return {
//     cart,
//     item: cart.items.length,
//     totalQuantity,
//     totalPrice,
//     voucherDiscount: voucherResult.discountAmount,
//     finalAmount,
//     voucherInfo: voucherResult.voucher
//       ? {
//           id: voucherResult.voucher._id,
//           code: voucherResult.voucher.code,
//           discountType: voucherResult.voucher.discountType,
//           discountValue: voucherResult.voucher.discountValue,
//           discountAmount: voucherResult.discountAmount,
//         }
//       : null,
//     voucherError: voucherResult.error,
//   };
// };

// export const getCartByUserService = async (userId, voucherCode) => {
//   const cart = await fetchUserCart(userId);
//   if (!cart) return null;

//   const { totalPrice, totalQuantity } = calculateCartTotals(cart.items);
//   const voucherResult = await tryApplyVoucher(voucherCode, totalPrice, userId);
//   const finalAmount = totalPrice - voucherResult.discountAmount;

//   return formatCartResponse(
//     cart,
//     totalQuantity,
//     totalPrice,
//     voucherResult,
//     finalAmount
//   );
// };
