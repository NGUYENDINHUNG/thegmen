import express from "express";
import { applyVoucher } from "../../../controllers/vouchersController.js";
import { verifyToken } from "../../../middleware/auth.js";
const VoucherRouter = express.Router();

VoucherRouter.use(verifyToken);

VoucherRouter.post("/apply", applyVoucher);

export default VoucherRouter;
