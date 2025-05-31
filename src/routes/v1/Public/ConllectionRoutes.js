import express from "express";
import {
  GetCollectionById,
  GetAllCollections,
} from "../../../controllers/conllectionController.js";

const CollectionRouter = express.Router();

CollectionRouter.get("/:slug", GetCollectionById);
CollectionRouter.get("/", GetAllCollections);

export default CollectionRouter;
