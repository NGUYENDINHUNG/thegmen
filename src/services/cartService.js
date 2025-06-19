import Cart from "../models/cartModel.schema.js";
import Variants from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";
import { validateAndApplyVoucherForCartService } from "./vouchersSevice.js";

export const calculateCartTotals = (cart) => {
  let totalPrice = 0;
  let totalQuantity = 0;
  let selectedItemsCount = 0;
  let selectedItems = [];
  let allItemsTotal = 0; // Thêm biến tính tổng tất cả sản phẩm

  // Tính tổng giá và số lượng cho tất cả sản phẩm
  cart.items.forEach((item) => {
    const price =
      item.productId?.finalPrice && item.productId.finalPrice > 0
        ? item.productId.finalPrice
        : item.productId?.price ?? 0;
    const quantity = item.quantity ?? 0;

    // Tính tổng cho tất cả sản phẩm
    allItemsTotal += price * quantity;

    // Tính tổng cho các sản phẩm được chọn
    if (item.selected) {
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
    totalPrice, // Tổng giá các sản phẩm được chọn
    totalQuantity, // Tổng số lượng các sản phẩm được chọn
    selectedItemsCount, // Số lượng sản phẩm được chọn
    selectedItems, // Danh sách sản phẩm được chọn
    allItemsTotal, // Tổng giá tất cả sản phẩm
    discountAmount, // Số tiền được giảm
    finalAmount, // Tổng tiền sau khi giảm
    voucherInfo: cart.appliedVoucher?.voucherId
      ? {
          voucherId: cart.appliedVoucher.voucherId._id,
          code: cart.appliedVoucher.code,
          discountValue: cart.appliedVoucher.discountValue,
        }
      : null,
  };
};
export const addToCartService = async (
  userId,
  productId,
  variantId,
  quantity
) => {
  try {
    let stock = 0;
    let name = "";
    let size = "";
    // Kiểm tra variant hoặc product
    if (variantId) {
      const variant = await Variants.findById(variantId);
      if (!variant) {
        return {
          EC: 404,
          EM: "Biến thể không tồn tại",
        };
      }
      if (variant.Products.toString() !== productId) {
        return {
          EC: 403,
          EM: "Biến thể không thuộc sản phẩm này",
        };
      }
      stock = variant.stock;
      size = variant.size;
    } else {
      const product = await Product.findById(productId);
      if (!product) {
        return {
          EC: 404,
          EM: "Sản phẩm không tồn tại",
        };
      }
      name = product.name;
    }

    // Kiểm tra số lượng
    if (quantity <= 0) {
      return {
        EC: 403,
        EM: "Số lượng sản phẩm phải lớn hơn 0",
      };
    }

    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    // Kiểm tra sản phẩm trong giỏ hàng
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

    // Kiểm tra số lượng tồn kho
    let currentQuantity = 0;
    if (itemIndex > -1) {
      currentQuantity = Number(cart.items[itemIndex].quantity);
    }
    if (currentQuantity + quantity > stock) {
      return {
        EC: 403,
        EM: `Chỉ còn ${stock} sản phẩm ${name} size ${size}  trong kho`,
      };
    }

    // Cập nhật giỏ hàng
    if (itemIndex > -1) {
      const item = cart.items[itemIndex];
      cart.items.splice(itemIndex, 1);
      item.quantity = currentQuantity + quantity;
      cart.items.unshift(item);
    } else {
      cart.items.unshift({ productId, variantId, quantity });
    }

    cart.updatedAt = new Date();
    await cart.save();

    return {
      EC: 0,
      EM: "Thêm sản phẩm vào giỏ hàng thành công",
      DT: cart,
    };
  } catch (error) {
    console.log("Error in addToCartService:", error);
    return {
      EC: 500,
      EM: "Lỗi server khi thêm sản phẩm vào giỏ hàng",
    };
  }
};
export const removeItemFromCartService = async (
  userId,
  productId,
  variantId
) => {
  try {
    // 1. Tìm giỏ hàng và populate thông tin sản phẩm
    const cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount",
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

    // 2. Tìm index của item cần xóa
    const itemIndex = cart.items.findIndex((item) => {
      if (variantId) {
        return (
          item.productId._id.toString() === productId &&
          item.variantId &&
          item.variantId._id.toString() === variantId
        );
      } else {
        return (
          item.productId._id.toString() === productId &&
          (!item.variantId || item.variantId === null)
        );
      }
    });

    if (itemIndex > -1) {
      // 3. Xóa item khỏi giỏ hàng
      cart.items.splice(itemIndex, 1);

      // 4. Tính toán lại các giá trị sử dụng calculateCartTotals
      const totals = calculateCartTotals(cart);

      // 5. Cập nhật giỏ hàng
      cart.finalAmount = totals.finalAmount;
      cart.updatedAt = new Date();
      await cart.save();

      // 6. Trả về thông tin giỏ hàng đã cập nhật
      return {
        cart,
        totalPrice: totals.totalPrice,
        discountAmount: totals.discountAmount,
        finalAmount: totals.finalAmount,
      };
    }

    return {
      cart,
      totalPrice: 0,
      discountAmount: 0,
      finalAmount: 0,
    };
  } catch (error) {
    console.log("Lỗi xóa sản phẩm khỏi giỏ hàng:", error);
    throw error;
  }
};
export const getCartByUserService = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount slug ",
      },
      {
        path: "items.variantId",
        select: "_id color  size images stock",
      },
      {
        path: "appliedVoucher.voucherId",
        select: "_id code name discountValue",
      },
    ]);

    if (!cart) return null;

    // Sử dụng hàm calculateCartTotals để tính toán các giá trị
    const totals = calculateCartTotals(cart);

    return {
      cart: {
        _id: cart._id,
        items: cart.items.map((item) => {
          const price = item.productId.finalPrice ?? item.productId.price ?? 0;
          const itemTotal = price * item.quantity;

          return {
            _id: item._id,
            selected: item.selected,
            quantity: item.quantity,
            product: {
              _id: item.productId._id,
              name: item.productId.name,
              price: price,
              avatar: item.productId.avatar,
              slug: item.productId.slug,
            },
            variant: {
              _id: item.variantId._id,
              color: item.variantId.color,
              size: item.variantId.size,
              stock: item.variantId.stock,
            },
            finalPrice: itemTotal,
          };
        }),
      },
      item: cart.items.length,
      totalPrice: totals.totalPrice,
      selectedItemsCount: totals.selectedItemsCount,
      discountAmount: totals.discountAmount,
      finalAmount: totals.finalAmount,

      voucherInfo: totals.voucherInfo,
    };
  } catch (error) {
    throw new Error(`Lấy giỏ hàng thất bại: ${error.message}`);
  }
};
export const updateItemSelectionService = async (userId, itemId, selected) => {
  try {
    const cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount slug",
      },
      {
        path: "items.variantId",
        select: "_id color size sku",
      },
      {
        path: "appliedVoucher.voucherId",
        select: "_id code name discountValue",
      },
    ]);

    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }

    // Tìm item cần cập nhật bằng itemId
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === itemId
    );

    if (itemIndex === -1) {
      throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    // Cập nhật trạng thái chọn
    cart.items[itemIndex].selected = selected;

    // Tính lại tổng tiền cho các sản phẩm được chọn
    let totalPrice = 0;
    let selectedItemsCount = 0;
    let selectedItemIds = [];

    cart.items.forEach((item) => {
      if (item.selected) {
        const price = item.productId.finalPrice ?? item.productId.price ?? 0;
        totalPrice += price * item.quantity;
        selectedItemsCount++;
        selectedItemIds.push(item._id);
      }
    });

    // Xử lý voucher nếu có
    let discountAmount = 0;
    let finalAmount = totalPrice;

    if (cart.appliedVoucher?.voucherId) {
      const voucher = cart.appliedVoucher.voucherId;
      discountAmount = (totalPrice * voucher.discountValue) / 100;
      finalAmount = totalPrice - discountAmount;
    }

    // Cập nhật giỏ hàng
    cart.finalAmount = finalAmount;
    cart.updatedAt = new Date();
    await cart.save();

    return {
      cart: {
        _id: cart._id,
        items: cart.items.map((item) => ({
          _id: item._id,
          selected: item.selected,
        })),
      },
      selectedItemIds,
      selectedItemsCount,
      totalPrice,
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
  } catch (error) {
    throw new Error(
      `Cập nhật trạng thái chọn sản phẩm thất bại: ${error.message}`
    );
  }
};

export const updateCartItemService = async (
  userId,
  productId,
  variantId,
  quantity
) => {
  try {
    const newQuantity = Number(quantity);
    if (isNaN(newQuantity)) {
      return {
        EC: 403,
        EM: "Số lượng không hợp lệ",
      };
    }

    // Kiểm tra số lượng phải là số dương
    if (newQuantity < 0) {
      return {
        EC: 403,
        EM: "Số lượng phải lớn hơn 0",
      };
    }

    let cart = await Cart.findOne({ userId }).populate([
      {
        path: "items.productId",
        select: "_id name finalPrice price avatar discount slug",
      },
      {
        path: "items.variantId",
        select: "_id color size sku images stock",
      },
      {
        path: "appliedVoucher.voucherId",
        select: "_id code name discountValue",
      },
    ]);

    if (!cart) {
      return {
        EC: 404,
        EM: "Không tìm thấy giỏ hàng của người dùng",
      };
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
      return {
        EC: 404,
        EM: "Sản phẩm không có trong giỏ hàng",
      };
    }

    if (variantId) {
      const variant = cart.items[itemIndex].variantId;
      if (!variant || !variant.stock) {
        return {
          EC: 403,
          EM: "Không thể kiểm tra số lượng tồn kho",
        };
      }
      if (newQuantity > variant.stock) {
        return {
          EC: 403,
          EM: `Số lượng yêu cầu (${newQuantity}) vượt quá số lượng tồn kho (${variant.stock})`,
        };
      }
    }

    if (newQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = newQuantity;
    }

    let totalPrice = 0;
    cart.items.forEach((item) => {
      if (item.selected) {
        const price =
          item.productId.finalPrice && item.productId.finalPrice > 0
            ? item.productId.finalPrice
            : item.productId.price ?? 0;
        totalPrice += price * item.quantity;
      }
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

    // Chỉ trả về item được update
    const updatedItem = newQuantity <= 0 ? null : cart.items[itemIndex];

    return {
      EC: 0,
      EM: "Cập nhật giỏ hàng thành công",
      DT: {
        cart: {
          _id: cart._id,
          userId: cart.userId,
          items: updatedItem, // Trả về object của item được update
          finalAmount: cart.finalAmount,
          updatedAt: cart.updatedAt,
          __v: cart.__v,
        },
        totalPrice,
        discountAmount,
        finalAmount,
      },
    };
  } catch (error) {
    console.log("Error updating cart:", error);
    return {
      EC: 500,
      EM: "Lỗi server khi cập nhật giỏ hàng",
    };
  }
};
