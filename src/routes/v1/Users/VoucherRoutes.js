import express from "express";
import {
  applyVoucherToCart,
  getAllVouchers,
  removeVoucherFromCart,
} from "#controllers/vouchersController.js";
import { verifyToken } from "#middleware/auth.js";
const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);
VoucherRouter.use(verifyToken);
VoucherRouter.post("/apply_voucher_to_cart", applyVoucherToCart);
VoucherRouter.post("/remove_voucher_from_cart", removeVoucherFromCart);

export default VoucherRouter;
