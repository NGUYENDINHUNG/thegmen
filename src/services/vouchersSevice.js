import Voucher from "../models/vouchersModel.schema.js";
import User from "../models/userModel.schema.js";
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
export const validateAndApplyVoucherService = async (
  code,
  orderValue,
  userId
) => {
  try {
    const voucher = await Voucher.findOne({ code });
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
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const usedVoucher = user.usedVouchers.find(
      (item) => item.voucherId.toString() === voucher._id.toString()
    );
    if (usedVoucher && usedVoucher.usageCount >= voucher.maxUsagePerUser) {
      throw new Error("Bạn đã sử dụng hết số lần cho phép với voucher này.");
    }

    const discountAmount = (orderValue * voucher.discountValue) / 100;
    

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
    console.log(error);
    throw error;
  }
};