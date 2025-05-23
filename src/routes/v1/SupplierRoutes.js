import express from "express";
import {
  CreateSupplier,
  UpdateCategory,
} from "../../Controllers/supplierController.js";
import { verifyToken } from "../../middleware/auth.js";

const SupplierRouter = express.Router();

SupplierRouter.post("/createSupplier", verifyToken, CreateSupplier);
SupplierRouter.put("/:id", verifyToken, UpdateCategory);

export default SupplierRouter;
