import express from "express";
import {
  GetCollectionById,
  GetAllCollections,
  GetProductsByCollectionSlug,
} from "../../../controllers/collectionController.js";

const CollectionRouter = express.Router();

CollectionRouter.get("/:slug", GetCollectionById);
CollectionRouter.get("/", GetAllCollections);
CollectionRouter.get("/products/:slug", GetProductsByCollectionSlug);

export default CollectionRouter;
