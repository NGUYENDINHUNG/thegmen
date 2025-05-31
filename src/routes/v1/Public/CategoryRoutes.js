import express from "express";
import {
  UpdateCategory,
  GetOneCategory,
} from "../../../controllers/categoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.put("/:id", UpdateCategory);
CategoryRouter.get("/:slug", GetOneCategory);
export default CategoryRouter;
