import Voucher from "../models/vouchersModel.schema.js";
import User from "../models/userModel.schema.js";
import Cart from "../models/cartModel.schema.js";
export const createVoucherService = async (voucherData) => {
  try {
    const exist = await Voucher.findOne({ code: voucherData.code });
    if (exist) {
      throw new Error("Mã voucher đã tồn tại");
    }
    const voucher = await Voucher.create(voucherData);
    return voucher;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllVouchersService = async () => {
  try {
    return await Voucher.find({});
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateVoucherService = async (id, updateData) => {
  try {
    return await Voucher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getVoucherByCodeService = async (code) => {
  try {
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      throw new Error("Không tìm thấy voucher với mã này");
    }
    return voucher;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const removeVoucherFromCartService = async (userId) => {
  try {
    // 1. Tìm giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      throw new Error("Không tìm thấy giỏ hàng");
    }

    // 2. Kiểm tra xem có voucher nào đang được áp dụng không
    if (!cart.appliedVoucher?.voucherId) {
      throw new Error("Không có voucher nào được áp dụng");
    }

    // 3. Lấy thông tin voucher đang được áp dụng
    const currentVoucherId = cart.appliedVoucher.voucherId;

    // 4. Cập nhật số lượng voucher (tăng lên 1 vì đang bỏ áp dụng)
    const voucher = await Voucher.findById(currentVoucherId);
    if (voucher) {
      voucher.quantity += 1;
      await voucher.save();
    }

    // 5. Cập nhật số lần sử dụng voucher của user
    const user = await User.findById(userId);
    if (user?.usedVouchers) {
      const usedVoucherIndex = user.usedVouchers.findIndex(
        (item) => item.voucherId.toString() === currentVoucherId.toString()
      );

      if (usedVoucherIndex !== -1) {
        user.usedVouchers[usedVoucherIndex].usageCount -= 1;

        // Nếu số lần sử dụng = 0 thì xóa voucher khỏi danh sách đã sử dụng
        if (user.usedVouchers[usedVoucherIndex].usageCount === 0) {
          user.usedVouchers.splice(usedVoucherIndex, 1);
        }

        await user.save();
      }
    }

    // 6. Tính lại tổng tiền giỏ hàng (không có voucher)
    const totalPrice = cart.items.reduce((total, item) => {
      const price = item.productId.finalPrice ?? item.productId.price ?? 0;
      return total + price * item.quantity;
    }, 0);

    // 7. Cập nhật giỏ hàng
    cart.appliedVoucher = null; // Xóa voucher
    cart.finalAmount = totalPrice; // Cập nhật tổng tiền
    await cart.save();

    // 8. Trả về kết quả
    return {
      cart,
      totalPrice,
      discountAmount: 0,
      finalAmount: totalPrice,
    };
  } catch (error) {
    console.log("Lỗi xóa voucher:", error);
    throw error;
  }
};
export const validateAndApplyVoucherForCartService = async (
  code,
  orderValue,
  userId,
  ignoreCurrentCartCheck = false
) => {
  try {
    if (!code) throw new Error("Vui lòng nhập mã voucher");

    const voucher = await Voucher.findOne({ code });
    if (!voucher) throw new Error("Mã voucher không tồn tại");

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate)
      throw new Error("Voucher đã hết hạn hoặc chưa đến thời gian sử dụng");

    if (voucher.status !== "active")
      throw new Error("Voucher không còn hiệu lực");
    if (voucher.quantity <= 0) throw new Error("Voucher đã hết số lượng");

    // Nếu có điều kiện tối thiểu:
    if (voucher.minimumOrderAmount && orderValue < voucher.minimumOrderAmount) {
      throw new Error(
        `Đơn hàng phải tối thiểu ${voucher.minimumOrderAmount}đ để áp dụng voucher`
      );
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("Người dùng không tồn tại");

    const usedVoucher = user.usedVouchers?.find(
      (item) => item.voucherId?.toString() === voucher._id.toString()
    );
    if (usedVoucher && usedVoucher.usageCount >= voucher.maxUsagePerUser) {
      throw new Error("Bạn đã sử dụng hết số lần cho phép với voucher này.");
    }

    const currentCart = await Cart.findOne({ userId });
    if (!ignoreCurrentCartCheck && currentCart?.appliedVoucher?.voucherId) {
      if (
        currentCart.appliedVoucher.voucherId.toString() ===
        voucher._id.toString()
      ) {
        throw new Error("Voucher này đã được áp dụng trong giỏ hàng của bạn");
      }

      // Trả lại voucher cũ
      const oldVoucher = await Voucher.findById(
        currentCart.appliedVoucher.voucherId
      );
      if (oldVoucher) {
        oldVoucher.quantity += 1;
        await oldVoucher.save();
      }

      const oldUsedVoucher = user.usedVouchers?.find(
        (item) =>
          item.voucherId?.toString() ===
          currentCart.appliedVoucher.voucherId.toString()
      );
      if (oldUsedVoucher) {
        oldUsedVoucher.usageCount -= 1;
        if (oldUsedVoucher.usageCount <= 0) {
          user.usedVouchers = user.usedVouchers.filter(
            (item) =>
              item.voucherId?.toString() !==
              currentCart.appliedVoucher.voucherId.toString()
          );
        }
      }

      // Cập nhật cart
      currentCart.appliedVoucher = undefined;
      await currentCart.save();
    }

    let discountAmount = (orderValue * voucher.discountValue) / 100;
    if (voucher.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscountAmount);
    }

    const finalAmount = orderValue - discountAmount;

    // Lưu user sau khi cập nhật usedVouchers
   await user.save();

    return {
      voucher,
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    console.error("Lỗi validate voucher:", error.message);
    throw error;
  }
};
