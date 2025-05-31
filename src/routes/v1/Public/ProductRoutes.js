import express from "express";
import {
  GetAllProducts,
  GetOnProduct,
} from "../../../controllers/productController.js";

const ProductRouter = express.Router();

ProductRouter.get("/", GetAllProducts);
ProductRouter.get("/:slug", GetOnProduct);
export default ProductRouter;
