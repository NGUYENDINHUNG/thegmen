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
export const validateAndApplyVoucherForCartService = async (
  code,
  orderValue,
  userId
) => {
  try {
    console.log(code, orderValue, userId);
    // Kiểm tra code có tồn tại không
    if (!code) {
      throw new Error("Vui lòng nhập mã voucher");
    }

    const voucher = await Voucher.findOne({ code: code }); 
    if (!voucher) {
      throw new Error("Mã voucher không tồn tại");
    }

    // Validate voucher
    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      throw new Error("Voucher đã hết hạn hoặc chưa đến thời gian sử dụng");
    }
    if (voucher.status !== "active") {
      throw new Error("Voucher không còn hiệu lực");
    }
    if (voucher.quantity <= 0) {
      throw new Error("Voucher đã hết số lượng");
    }

    // Kiểm tra user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    // Kiểm tra số lần sử dụng
    const usedVoucher = user.usedVouchers?.find(
      (item) => item?.voucherId?.toString() === voucher._id.toString()
    );
    if (usedVoucher && usedVoucher.usageCount >= voucher.maxUsagePerUser) {
      throw new Error("Bạn đã sử dụng hết số lần cho phép với voucher này.");
    }

    // Kiểm tra voucher đã được sử dụng trong cart
    const currentCart = await Cart.findOne({ userId });
    if (currentCart?.appliedVoucher?.voucherId) {
      if (currentCart.appliedVoucher.voucherId.toString() === voucher._id.toString()) {
        throw new Error("Voucher này đã được áp dụng trong giỏ hàng của bạn");
      }

      // Hoàn trả voucher cũ
      const oldVoucher = await Voucher.findById(currentCart.appliedVoucher.voucherId);
      if (oldVoucher) {
        oldVoucher.quantity += 1;
        await oldVoucher.save();
      }

      const oldUsedVoucher = user.usedVouchers?.find(
        (item) => item?.voucherId?.toString() === currentCart.appliedVoucher.voucherId.toString()
      );
      if (oldUsedVoucher) {
        oldUsedVoucher.usageCount -= 1;
        if (oldUsedVoucher.usageCount === 0) {
          user.usedVouchers = user.usedVouchers.filter(
            (item) => item?.voucherId?.toString() !== currentCart.appliedVoucher.voucherId.toString()
          );
        }
      }
    }

    const discountAmount = (orderValue * voucher.discountValue) / 100;
    const finalAmount = orderValue - discountAmount;

    return {
      voucher,
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    console.log("Lỗi validate voucher:", error);
    throw error;
  }
};