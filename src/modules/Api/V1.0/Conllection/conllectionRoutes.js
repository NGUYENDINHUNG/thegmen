import express from "express";
import {
  CreateCollection,
  UpdateCollection,
  GetCollectionById,
  GetAllCollection,
  SoftDeleteCollection,
  RestoreCollection,
  AddProductToCollection,
  RemoveProductFromCollection,
  GetProductsByCollectionId,
  GetCollectionsByProductId,
} from "./conllectionController.js";

const CollectionRouter = express.Router();

// Quản lý bộ sưu tập
CollectionRouter.post("/create", CreateCollection);
CollectionRouter.put("/update/:id", UpdateCollection);
CollectionRouter.get("/:id", GetCollectionById);
CollectionRouter.get("/", GetAllCollection);
CollectionRouter.put("/softDelete/:collectionId", SoftDeleteCollection);
CollectionRouter.put("/restore/:collectionId", RestoreCollection);

// Quản lý mối quan hệ sản phẩm - bộ sưu tập
CollectionRouter.post("/addProduct", AddProductToCollection);
CollectionRouter.post("/removeProduct", RemoveProductFromCollection);
CollectionRouter.get("/products/:collectionId", GetProductsByCollectionId);
CollectionRouter.get("/byProduct/:productId", GetCollectionsByProductId);

export default CollectionRouter;
