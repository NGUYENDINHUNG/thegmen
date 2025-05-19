import { VoucherModel, UserModel } from "../../../../models/index.js";
export const createVoucherService = async (voucherData) => {
  try {
    const exist = await VoucherModel.findOne({ code: voucherData.code });
    if (exist) {
      throw new Error("Mã voucher đã tồn tại");
    }
    const voucher = await VoucherModel.create(voucherData);
    return voucher;
  } catch (error) {
    throw error;
  }
};

export const getAllVouchersService = async () => {
  try {
    return await VoucherModel.find({});
  } catch (error) {
    throw error;
  }
};

export const updateVoucherService = async (id, updateData) => {
  try {
    return await VoucherModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw error;
  }
};

export const getVoucherByCodeService = async (code) => {
  try {
    const voucher = await VoucherModel.findOne({ code });
    if (!voucher) {
      throw new Error("Không tìm thấy voucher với mã này");
    }
    return voucher;
  } catch (error) {
    throw error;
  }
};
export const validateAndApplyVoucherService = async (
  code,
  orderValue,
  userId
) => {
  try {
    const voucher = await VoucherModel.findOne({ code });
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }
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
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const usedVoucher = user.usedVouchers.find(
      (item) => item.voucherId.toString() === voucher._id.toString()
    );
    if (usedVoucher && usedVoucher.usageCount >= voucher.maxUsagePerUser) {
      throw new Error("Bạn đã sử dụng hết số lần cho phép với voucher này.");
    }

    let discountAmount = 0;
    if (voucher.discountType === "percentage") {
      discountAmount = (orderValue * voucher.discountValue) / 100;
    } else {
      discountAmount = voucher.discountValue;
    }
    console.log(discountAmount);

    if (usedVoucher) {
      usedVoucher.usageCount += 1;
    } else {
      user.usedVouchers.push({ voucherId: voucher._id, usageCount: 1 });
    }
    voucher.quantity -= 1;
    await voucher.save();
    await user.save();
    const finalAmount = orderValue - discountAmount;
    return {
      voucher,
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    throw error;
  }
};
