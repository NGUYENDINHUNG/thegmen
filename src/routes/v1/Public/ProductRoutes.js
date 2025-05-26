import express from "express";
import {
  GetAllProducts,
  GetProductById,
} from "../../../Controllers/productController.js";

const ProductRouter = express.Router();

ProductRouter.get("/:ProductId", GetProductById);
ProductRouter.get("/", GetAllProducts);

export default ProductRouter;
