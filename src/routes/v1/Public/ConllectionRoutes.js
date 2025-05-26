import express from "express";
import {
  GetCollectionById,
  GetAllCollection,
} from "../../../Controllers/conllectionController.js";

const CollectionRouter = express.Router();

CollectionRouter.get("/:id", GetCollectionById);
CollectionRouter.get("/", GetAllCollection);

export default CollectionRouter;
