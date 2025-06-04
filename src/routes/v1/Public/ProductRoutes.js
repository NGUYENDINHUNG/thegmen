import express from "express";
import {
  GetAllProducts,
  GetOnProduct,
  FilterProducts,
} from "../../../controllers/productController.js";

const ProductRouter = express.Router();

ProductRouter.get("/", GetAllProducts);
ProductRouter.get("/filter", FilterProducts);
ProductRouter.get("/:slug", GetOnProduct);

export default ProductRouter;
