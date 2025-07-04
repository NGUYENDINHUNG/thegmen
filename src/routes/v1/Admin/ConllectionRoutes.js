import express from "express";
import {
  CreateCollection,
  UpdateCollection,
  SoftDeleteCollection,
  RestoreCollection,
  AddProductToCollection,
  RemoveProductFromCollection,
} from "../../../controllers/collectionController.js";

import checkPermission from "../../../middleware/checkPermission.js";

const CollectionRouter = express.Router();

// RESTful endpoints
CollectionRouter.post(
  "/",
  checkPermission("Create_Collection"),
  CreateCollection
);

CollectionRouter.put(
  "/:id",
  checkPermission("Update_Collection"),
  UpdateCollection
);

CollectionRouter.delete(
  "/:id",
  checkPermission("SoftDelete_Collection"),
  SoftDeleteCollection
);

CollectionRouter.post(
  "/:id/restore",
  checkPermission("Restore_Collection"),
  RestoreCollection
);

CollectionRouter.post(
  "/:id/products",
  AddProductToCollection
);

CollectionRouter.delete(
  "/:id/products/:productId",
  checkPermission("RemoveProduct_Collection"),
  RemoveProductFromCollection
);

export default CollectionRouter;
