import express from "express";
import {
  createVariant,
  updateVariant,
  softDeleteVariant,
  restoreVariant,
} from "#controllers/variantController.js";
import checkPermission from "#middleware/checkPermission.js";

const VariantRouter = express.Router();

VariantRouter.post(
  "/createVariant",
  checkPermission("Create_Variant"),
  createVariant
);
VariantRouter.put(
  "/update/:variantId",
  checkPermission("Update_Variant"),
  updateVariant
);
VariantRouter.put(
  "/softDelete/:variantId",
  checkPermission("SoftDelete_Variant"),
  softDeleteVariant
);
VariantRouter.put(
  "/restore/:variantId",
  checkPermission("Restore_Variant"),
  restoreVariant
);
export default VariantRouter;
