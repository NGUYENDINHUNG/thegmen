import express from "express";
import {
  CreateCategory,
  UpdateCategory,
  GetCategoryById,
  GetAllCategory,
} from "./categoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.post("/createCategory", CreateCategory);
CategoryRouter.put("/:id", UpdateCategory);
CategoryRouter.get("/:id", GetCategoryById);
CategoryRouter.get("/list", GetAllCategory);
export default CategoryRouter;
