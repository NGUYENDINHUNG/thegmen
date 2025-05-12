import express from "express";
import {
  createVoucher,
  getAllVouchers,
  updateVoucher,
  applyVoucher,
} from "../Controller/vouchersController.js";
import { verifyToken } from "../middleware/auth.js";

const VoucherRouter = express.Router();

VoucherRouter.post("/createVoucher", verifyToken, createVoucher);
VoucherRouter.put("/:id", verifyToken, updateVoucher);
VoucherRouter.get("/", verifyToken, getAllVouchers);
VoucherRouter.post("/apply", verifyToken, applyVoucher);

export default VoucherRouter;
