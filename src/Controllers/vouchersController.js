import Cart from "../models/cartModel.schema.js";
import {
  createVoucherService,
  getAllVouchersService,
  removeVoucherFromCartService,
  updateVoucherService,
  validateAndApplyVoucherForCartService,
} from "../services/vouchersService.js";

export const createVoucher = async (req, res) => {
  try {
    const voucher = await createVoucherService(req.body);
    return res.status(201).json({
      statusCode: 201,
      message: "Tạo voucher thành công",
      data: voucher,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Tạo voucher thất bại",
    });
  }
};

export const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await getAllVouchersService();
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách voucher thành công",
      data: vouchers,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi khi lấy danh sách voucher",
    });
  }
};

export const updateVoucher = async (req, res) => {
  try {
    const voucher = await updateVoucherService(req.params.id, req.body);
    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật voucher thành công",
      data: voucher,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Cập nhật voucher thất bại",
    });
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
      statusCode: 200,
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
      statusCode: 400,
      message: error.message || "Áp dụng voucher thất bại",
    });
  }
};

export const removeVoucherFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await removeVoucherFromCartService(userId);

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa voucher khỏi giỏ hàng thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa voucher thất bại",
    });
  }
};
