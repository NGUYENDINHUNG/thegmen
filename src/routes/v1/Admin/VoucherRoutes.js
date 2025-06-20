import express from "express";
import {
  createVoucher,
  updateVoucher,
} from "#controllers/vouchersController.js";
import checkPermission from "#middleware/checkPermission.js";
const VoucherRouter = express.Router();

VoucherRouter.post(
  "/createVoucher",
  checkPermission("Create_Voucher"),
  createVoucher
);
VoucherRouter.put("/:id", checkPermission("Update_Voucher"), updateVoucher);
export default VoucherRouter;
