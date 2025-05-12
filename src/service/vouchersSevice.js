import { Voucher, VoucherUsage } from "../model/VouchersModel.schema.js";

export const createVoucherService = async (voucherData) => {
  try {
    const exist = await Voucher.findOne({ code: voucherData.code });
    if (exist) {
      throw new Error("Mã voucher đã tồn tại");
    }

    const voucher = await Voucher.create(voucherData);
    return voucher;
  } catch (error) {
    throw error;
  }
};

export const getAllVouchersService = async () => {
  try {
    return await Voucher.find({});
  } catch (error) {
    throw error;
  }
};

export const getVoucherByIdService = async (id) => {
  try {
    return await Voucher.findById(id);
  } catch (error) {
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
    throw error;
  }
};
export const validateAndApplyVoucherService = async (
  code,
  orderValue,
  userId
) => {
  try {
    const voucher = await getVoucherByCodeService(code);

    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }

    if (voucher.status !== "active") {
      throw new Error("Voucher không còn hiệu lực");
    }

    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate) {
      throw new Error("Voucher đã hết hạn hoặc chưa đến thời gian sử dụng");
    }

    if (voucher.quantity <= 0) {
      throw new Error("Voucher đã hết số lượng");
    }

    const usage = await VoucherUsage.findOne({
      voucherId: voucher._id,
      userId,
    });
    if (usage && usage.usageCount >= voucher.maxUsagePerUser) {
      throw new Error(
        `Bạn đã sử dụng hết số lần được phép sử dụng voucher này (${voucher.maxUsagePerUser} lần)`
      );
    }

    // Tính toán giá trị giảm giá
    let discountAmount = 0;
    if (voucher.discountType === "percentage") {
      discountAmount = (orderValue * voucher.discountValue) / 100;
    } else {
      discountAmount = voucher.discountValue;
    }
    // Cập nhật số lần sử dụng
    await VoucherUsage.findOneAndUpdate(
      { voucherId: voucher._id, userId },
      { $inc: { usageCount: 1 } },
      { upsert: true }
    );

    // Giảm số lượng voucher
    voucher.quantity -= 1;
    await voucher.save();

    return {
      voucher,
      discountAmount,
      finalAmount: orderValue - discountAmount,
    };
  } catch (error) {
    throw error;
  }
};
