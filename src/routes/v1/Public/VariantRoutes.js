import express from "express";
import {
  getVariantById,
  getVariantsByProductId,
  getAllVariants,
} from "../../../Controllers/variantController.js";

const VariantRouter = express.Router();

VariantRouter.get("/:variantId", getVariantById);
VariantRouter.get("/:productId", getVariantsByProductId);
VariantRouter.get("/", getAllVariants);

export default VariantRouter;
