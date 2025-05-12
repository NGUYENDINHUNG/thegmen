import {
  createVoucherService,
  getAllVouchersService,
  getVoucherByIdService,
  updateVoucherService,
  validateAndApplyVoucherService,
} from "../service/VouchersSevice.js";

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

export const getVoucherById = async (req, res) => {
  try {
    const voucher = await getVoucherByIdService(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json({ message: "Lấy voucher thành công", data: voucher });
  } catch (error) {
    res.status(400).json({ message: error.message || "Lỗi lấy voucher" });
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

export const validateAndApplyVoucher = async (req, res) => {
  try {
    const { code, orderValue, userId } = req.body;
    const result = await validateAndApplyVoucherService(
      code,
      orderValue,
      userId
    );
    res
      .status(200)
      .json({ message: "Áp dụng voucher thành công", data: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message || "Lỗi áp dụng voucher" });
  }
};
