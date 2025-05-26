import express from "express";
import {
  UpdateCategory,
  GetAllCategory,
} from "../../../controllers/categoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.put("/:id", UpdateCategory);
CategoryRouter.get("/", GetAllCategory);
export default CategoryRouter;
