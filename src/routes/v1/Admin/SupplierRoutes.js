import express from "express";
import {
  CreateSupplier,
  UpdateCategory,
} from "../../../Controllers/supplierController.js";
import checkPermission from "../../../middleware/checkPermission.js";

const SupplierRouter = express.Router();

SupplierRouter.post(
  "/createSupplier",
  checkPermission("Create_Supplier"),
  CreateSupplier
);
SupplierRouter.put("/:id", checkPermission("Update_Supplier"), UpdateCategory);

export default SupplierRouter;
