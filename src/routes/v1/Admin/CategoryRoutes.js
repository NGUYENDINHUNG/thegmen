import express from "express";
import {
  CreateCategory,
  UpdateCategory,
} from "#controllers/categoryController.js";
import checkPermission from "#middleware/checkPermission.js";
const CategoryRouter = express.Router();

CategoryRouter.post(
  "/createCategory",
  checkPermission("Create_Category"),
  CreateCategory
);
CategoryRouter.put("/:id", checkPermission("Update_Category"), UpdateCategory);

export default CategoryRouter;
