import Cart from "#models/cartModel.schema.js";
import {
  createVoucherService,
  getAllVouchersService,
  removeVoucherFromCartService,
  updateVoucherService,
  validateAndApplyVoucherForCartService,
} from "#services/vouchersSevice.js";

export const createVoucher = async (req, res) => {
  try {
    const voucher = await createVoucherService(req.body);
    res
      .status(200)
      .json({ status: 200, message: "Tạo voucher thành công", data: voucher });
  } catch (error) {
    res.status(400).json({ message: error.message || "Lỗi tạo voucher" });
  }
};

export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await getAllVouchersService();
    res
      .status(200)
      .json({ message: "Lấy danh sách voucher thành công", data: vouchers });
  } catch (error) {
    res
      .status(400)
      .json({ message: error.message || "Lỗi lấy danh sách voucher" });
  }
};
export const updateVoucher = async (req, res) => {
  try {
    const voucher = await updateVoucherService(req.params.id, req.body);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res
      .status(200)
      .json({ message: "Cập nhật voucher thành công", data: voucher });
  } catch (error) {
    res.status(400).json({ message: error.message || "Lỗi cập nhật voucher" });
  }
};

export const applyVoucherToCart = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user._id;

    const result = await validateAndApplyVoucherForCartService(
      code,
      orderValue,
      userId
    );

    await Cart.findOneAndUpdate(
      { userId },
      {
        finalAmount: result.finalAmount,
        appliedVoucher: {
          voucherId: result.voucher._id,
          code: result.voucher.code,
          discountValue: result.voucher.discountValue,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Áp dụng voucher thành công",
      data: {
        voucher: {
          _id: result.voucher._id,
          code: result.voucher.code,
          name: result.voucher.name,
          discountValue: result.voucher.discountValue,
          startDate: result.voucher.startDate,
          endDate: result.voucher.endDate,
          quantity: result.voucher.quantity,
          status: result.voucher.status,
          maxUsagePerUser: result.voucher.maxUsagePerUser,
        },
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể áp dụng voucher",
    });
  }
};
export const removeVoucherFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await removeVoucherFromCartService(userId);

    return res.status(200).json({
      status: 200,
      message: "Xóa voucher thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Không thể xóa voucher",
    });
  }
};
