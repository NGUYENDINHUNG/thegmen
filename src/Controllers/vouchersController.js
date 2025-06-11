import {
  createVoucherService,
  getAllVouchersService,
  updateVoucherService,
  validateAndApplyVoucherService,
} from "../services/vouchersSevice.js";

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

export const applyVoucher = async (req, res) => {
  try {
    const { voucherCode, orderValue } = req.body;
    const userId = req.user._id;

    const result = await validateAndApplyVoucherService(
      voucherCode,
      orderValue,
      userId
    );

    return res.status(200).json({
      status: 200,
      message: "Áp dụng voucher thành công",
      data: {
        voucherId: result.voucher._id,
        code: result.voucher.code,
        discountValue: result.voucher.discountValue,
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

