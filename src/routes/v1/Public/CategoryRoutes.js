import express from "express";
import {
  GetOneCategory,
  GetAllCategories,
} from "../../../controllers/categoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.get("/:slug", GetOneCategory);
CategoryRouter.get("/", GetAllCategories);
export default CategoryRouter;
