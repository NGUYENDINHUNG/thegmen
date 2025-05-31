import express from "express";
import {
  CreateCollection,
  UpdateCollection,
  SoftDeleteCollection,
  RestoreCollection,
  AddProductToCollection,
  RemoveProductFromCollection,
} from "../../../Controllers/conllectionController.js";

import checkPermission from "../../../middleware/checkPermission.js";

const CollectionRouter = express.Router();

CollectionRouter.post(
  "/create",
  checkPermission("Create_Collection"),
  CreateCollection
);
CollectionRouter.put(
  "/update/:slug",
  checkPermission("Update_Collection"),
  UpdateCollection
);
CollectionRouter.put(
  "/softDelete/:slug",
  checkPermission("SoftDelete_Collection"),
  SoftDeleteCollection
);
CollectionRouter.put(
  "/restore/:collectionId",
  checkPermission("Restore_Collection"),
  RestoreCollection
);
CollectionRouter.post(
  "/addProduct",
  checkPermission("AddProduct_Collection"),
  AddProductToCollection
);
CollectionRouter.post(
  "/removeProduct",
  checkPermission("RemoveProduct_Collection"),
  RemoveProductFromCollection
);

export default CollectionRouter;
