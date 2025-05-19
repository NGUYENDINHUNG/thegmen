import express from "express";
import {
  CreateProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  SoftDeleteProduct,
  RestoreProduct,
} from "./productController.js";

const ProductRouter = express.Router();

ProductRouter.post("/createProduct", CreateProduct);
ProductRouter.put("/updateProduct/:ProductId", UpdateProduct);
ProductRouter.get("/:ProductId", GetProductById);
ProductRouter.get("/", GetAllProducts);
ProductRouter.put("/softDelete/:ProductId", SoftDeleteProduct);
ProductRouter.put("/restore/:ProductId", RestoreProduct);
export default ProductRouter;
