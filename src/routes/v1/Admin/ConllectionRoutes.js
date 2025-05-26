import express from "express";
import {
  CreateCollection,
  UpdateCollection,
  SoftDeleteCollection,
  RestoreCollection,
  AddProductToCollection,
  RemoveProductFromCollection,
  GetProductsByCollectionId,
  GetCollectionsByProductId,
} from "../../../Controllers/conllectionController.js";

import checkPermission from "../../../middleware/checkPermission.js";
const CollectionRouter = express.Router();

CollectionRouter.post(
  "/create",
  checkPermission("Create_Collection"),
  CreateCollection
);
CollectionRouter.put(
  "/update/:id",
  checkPermission("Update_Collection"),
  UpdateCollection
);
CollectionRouter.put(
  "/softDelete/:collectionId",
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
CollectionRouter.get(
  "/products/:collectionId",
  checkPermission("Get_Products_Collection"),
  GetProductsByCollectionId
);
CollectionRouter.get(
  "/byProduct/:productId",
  checkPermission("Get_Collections_By_Product_Id"),
  GetCollectionsByProductId
);

export default CollectionRouter;
