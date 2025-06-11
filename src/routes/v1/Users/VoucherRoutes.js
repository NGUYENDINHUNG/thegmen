import express from "express";
import {
  applyVoucher,
  getAllVouchers,
} from "../../../controllers/vouchersController.js";
import { verifyToken } from "../../../middleware/auth.js";
const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);
VoucherRouter.use(verifyToken);
VoucherRouter.post("/apply", applyVoucher);

export default VoucherRouter;
