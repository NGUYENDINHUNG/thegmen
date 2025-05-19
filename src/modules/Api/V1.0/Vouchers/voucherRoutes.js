import express from "express";
import {
  createVoucher,
  getAllVouchers,
  updateVoucher,
  applyVoucher,
} from "./vouchersController.js";

const VoucherRouter = express.Router();

VoucherRouter.post("/createVoucher", createVoucher);
VoucherRouter.put("/:id", updateVoucher);
VoucherRouter.get("/", getAllVouchers);
VoucherRouter.post("/apply", applyVoucher);

export default VoucherRouter;
