import express from "express";
import {
  CreateSupplier,
  UpdateCategory,
} from "./supplierController.js";


const SupplierRouter = express.Router();

SupplierRouter.post("/createSupplier", CreateSupplier);
SupplierRouter.put("/:id", UpdateCategory);

export default SupplierRouter;
