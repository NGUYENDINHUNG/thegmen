import express from "express";
import {
  CreateProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  SoftDeleteProduct,
  RestoreProduct,
} from "../Controllers/productController.js";
import { verifyToken } from "../middleware/auth.js";

const ProductRouter = express.Router();

ProductRouter.post("/createProduct", verifyToken, CreateProduct);
ProductRouter.put("/updateProduct/:ProductId", verifyToken, UpdateProduct);
ProductRouter.get("/:ProductId", verifyToken, GetProductById);
ProductRouter.get("/", verifyToken, GetAllProducts);
ProductRouter.put("/softDelete/:ProductId", verifyToken, SoftDeleteProduct);
ProductRouter.put("/restore/:ProductId", verifyToken, RestoreProduct);
export default ProductRouter;
