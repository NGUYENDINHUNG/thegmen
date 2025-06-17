import express from "express";
import {
  GetAllProducts,
  GetOnProduct,
  FilterProducts,
  GetRelatedProducts,
  getTrendingProducts,
} from "../../../controllers/productController.js";

const ProductRouter = express.Router();

ProductRouter.get("/", GetAllProducts);
ProductRouter.get("/filter", FilterProducts);
ProductRouter.get("/trending", getTrendingProducts);
ProductRouter.get("/:slug", GetOnProduct);
ProductRouter.get("/related/:slug", GetRelatedProducts);

export default ProductRouter;
