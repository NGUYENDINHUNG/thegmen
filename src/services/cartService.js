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
    // 1. Ép kiểu quantity về số (phòng trường hợp nhận được string)
    const newQuantity = Number(quantity);

    // 2. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) throw new Error("Giỏ hàng không tồn tại");

    // 3. Tìm vị trí sản phẩm trong giỏ hàng (có thể có variant hoặc không)
    const itemIndex = cart.items.findIndex((item) => {
      // Nếu có variantId, so sánh cả productId và variantId
      if (variantId) {
        return (
          item.productId._id.toString() === productId &&
          item.variantId &&
          item.variantId.toString() === variantId
        );
      } else {
        // Nếu không có variantId, chỉ so sánh productId
        return (
          item.productId._id.toString() === productId &&
          (!item.variantId || item.variantId === null)
        );
      }
    });

    // 4. Nếu không tìm thấy sản phẩm trong giỏ hàng, báo lỗi
    if (itemIndex === -1) {
      throw new Error("Sản phẩm không có trong giỏ hàng");
    }

    // 5. Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
    if (newQuantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Ngược lại, cập nhật số lượng mới cho sản phẩm
      cart.items[itemIndex].quantity = newQuantity;
    }

    // 6. Tính lại tổng giá trị giỏ hàng (totalPrice)
    let totalPrice = 0;
    cart.items.forEach((item) => {
      // Lấy giá cuối cùng (finalPrice nếu có, không thì price)
      const price = item.productId.finalPrice ?? item.productId.price ?? 0;
      totalPrice += price * item.quantity;
    });

    // 7. Nếu có voucher đang áp dụng, tính lại discount và finalAmount
    let discountAmount = 0;
    let finalAmount = totalPrice;
    if (cart.appliedVoucher?.code) {
      // Gọi service tính lại giảm giá dựa trên voucher và tổng giá mới
      const voucherResult = await validateAndApplyVoucherForCartService(
        cart.appliedVoucher.code,
        totalPrice,
        userId
      );
      discountAmount = voucherResult.discountAmount;
      finalAmount = voucherResult.finalAmount;
      cart.finalAmount = finalAmount; // Lưu lại tổng tiền sau giảm vào cart
    } else {
      // Nếu không có voucher, tổng tiền sau giảm chính là tổng giá
      cart.finalAmount = totalPrice;
    }

    // 8. Cập nhật thời gian sửa đổi giỏ hàng
    cart.updatedAt = new Date();

    // 9. Lưu lại giỏ hàng vào database
    await cart.save();

    // 10. Trả về kết quả chi tiết cho client
    return {
      cart,           // Thông tin giỏ hàng mới nhất
      totalPrice,     // Tổng giá trị giỏ hàng trước giảm giá
      discountAmount, // Số tiền được giảm nhờ voucher (nếu có)
      finalAmount,    // Tổng tiền phải trả sau khi giảm giá
    };
  } catch (error) {
    // Nếu có lỗi, trả về thông báo lỗi rõ ràng
    throw new Error(`Cập nhật giỏ hàng thất bại: ${error.message}`);
  }
};