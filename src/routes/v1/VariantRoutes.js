import express from "express";
import {
  createVariant,
  updateVariant,
  getVariantById,
  getVariantsByProductId,
  getAllVariants,
  softDeleteVariant,
  restoreVariant,
} from "../../Controllers/variantController.js";
import {verifyToken} from "../../middleware/auth.js";

const VariantRouter = express.Router();

VariantRouter.post("/createVariant", verifyToken, createVariant);
VariantRouter.put("/update/:variantId", verifyToken, updateVariant);
VariantRouter.get("/:variantId", verifyToken, getVariantById);
VariantRouter.get("/:productId", verifyToken, getVariantsByProductId);
VariantRouter.get("/", verifyToken, getAllVariants);
VariantRouter.put("/softDelete/:variantId", verifyToken, softDeleteVariant);
VariantRouter.put("/restore/:variantId", verifyToken, restoreVariant);

export default VariantRouter;
