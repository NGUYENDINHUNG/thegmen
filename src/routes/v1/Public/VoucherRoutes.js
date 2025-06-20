import express from "express";
import { getAllVouchers } from "#controllers/vouchersController.js";

const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);

export default VoucherRouter;
