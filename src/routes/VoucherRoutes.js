import express from "express";
import {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  validateAndApplyVoucher,
} from "../Controller/VouchersController.js";
import verifyToken from "../middleware/auth.js";

const VoucherRouter = express.Router();

VoucherRouter.post("/createVoucher", verifyToken, createVoucher);
VoucherRouter.put("/:id", verifyToken, updateVoucher);
VoucherRouter.get("/:voucherId", verifyToken, getVoucherById);
VoucherRouter.get("/", verifyToken, getAllVouchers);
VoucherRouter.post("/apply", verifyToken, validateAndApplyVoucher);

export default VoucherRouter;
