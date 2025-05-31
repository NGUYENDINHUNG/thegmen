import express from "express";
import {
  CreateProduct,
  UpdateProduct,
  SoftDeleteProduct,
  RestoreProduct,
} from "../../../controllers/productController.js";
import checkPermission from "../../../middleware/checkPermission.js";

const ProductRouter = express.Router();

ProductRouter.post(
  "/createProduct",
  checkPermission("Create_Product"),
  CreateProduct
);
ProductRouter.put(
    "/updateProduct/:ProductId",
  checkPermission("Update_Product"),
  UpdateProduct
);
ProductRouter.put(
  "/softDelete/:ProductId",
  checkPermission("SoftDelete_Product"),
  SoftDeleteProduct
);
ProductRouter.put(
  "/restore/:ProductId",
  checkPermission("Restore_Product"),
  RestoreProduct
);

export default ProductRouter;
