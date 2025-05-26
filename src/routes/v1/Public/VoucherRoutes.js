import express from "express";
import { getAllVouchers } from "../../../Controllers/vouchersController.js";

const VoucherRouter = express.Router();

VoucherRouter.get("/", getAllVouchers);

export default VoucherRouter;
