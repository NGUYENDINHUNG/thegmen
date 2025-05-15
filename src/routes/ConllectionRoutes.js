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
} from "../Controllers/conllectionController.js";
import { verifyToken } from "../middleware/auth.js";

const CollectionRouter = express.Router();

// Quản lý bộ sưu tập
CollectionRouter.post("/create", verifyToken, CreateCollection);
CollectionRouter.put("/update/:id", verifyToken, UpdateCollection);
CollectionRouter.get("/:id", verifyToken, GetCollectionById);
CollectionRouter.get("/", verifyToken, GetAllCollection);
CollectionRouter.put("/softDelete/:collectionId", verifyToken, SoftDeleteCollection);
CollectionRouter.put("/restore/:collectionId", verifyToken, RestoreCollection);

// Quản lý mối quan hệ sản phẩm - bộ sưu tập
CollectionRouter.post("/addProduct", verifyToken, AddProductToCollection);
CollectionRouter.post("/removeProduct", verifyToken, RemoveProductFromCollection);
CollectionRouter.get("/products/:collectionId", verifyToken, GetProductsByCollectionId);
CollectionRouter.get("/byProduct/:productId", verifyToken, GetCollectionsByProductId);

export default CollectionRouter;
