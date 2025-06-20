import express from "express";
import {
  UpdateCategory,
  GetOneCategory,
  GetAllCategories,
} from "#controllers/categoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.put("/:id", UpdateCategory);
CategoryRouter.get("/:slug", GetOneCategory);
CategoryRouter.get("/", GetAllCategories);
export default CategoryRouter;
