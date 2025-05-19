import express from "express";
import {
  createVariant,
  updateVariant,
  getVariantById,
  getVariantsByProductId,
  getAllVariants,
  softDeleteVariant,
  restoreVariant,
} from "./variantController.js";

const VariantRouter = express.Router();

VariantRouter.post("/createVariant", createVariant);
VariantRouter.put("/update/:variantId", updateVariant);
VariantRouter.get("/:variantId", getVariantById);
VariantRouter.get("/:productId", getVariantsByProductId);
VariantRouter.get("/", getAllVariants);
VariantRouter.put("/softDelete/:variantId", softDeleteVariant);
VariantRouter.put("/restore/:variantId", restoreVariant);

export default VariantRouter;
