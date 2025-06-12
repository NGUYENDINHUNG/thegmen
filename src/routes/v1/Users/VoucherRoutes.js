import express from "express";
import {
  applyVoucherToCart,
  getAllVouchers,
} from "../../../controllers/vouchersController.js";
import { verifyToken } from "../../../middleware/auth.js";
const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);
VoucherRouter.use(verifyToken);
VoucherRouter.post("/apply_voucher_to_cart", applyVoucherToCart);

export default VoucherRouter;
