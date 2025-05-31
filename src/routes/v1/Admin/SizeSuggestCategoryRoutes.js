import express from "express";
import {
  createSizeSuggestCategoryController,
  updateSizeSuggestCategoryController,
  deleteSizeSuggestCategoryController,
  getSizeSuggestCategoryByIdController,
} from "../../../controllers/sizeSuggestCategory.js";

const SizeSuggestCategoryRouter = express.Router();

SizeSuggestCategoryRouter.post("/createSizeSuggestCategory", createSizeSuggestCategoryController);
SizeSuggestCategoryRouter.put("/:id", updateSizeSuggestCategoryController);
SizeSuggestCategoryRouter.delete("/:id", deleteSizeSuggestCategoryController);
SizeSuggestCategoryRouter.get("/:id", getSizeSuggestCategoryByIdController);

export default SizeSuggestCategoryRouter;
