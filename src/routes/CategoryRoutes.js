import express from "express";
import {
  CreateCategory,
  UpdateCategory,
  GetCategoryById,
  GetAllCategory,
} from "../Controller/CategoryController.js";
import verifyToken from "../middleware/auth.js";

const CategoryRouter = express.Router();

CategoryRouter.post("/createCategory", verifyToken, CreateCategory);
CategoryRouter.put("/:id", verifyToken, UpdateCategory);
CategoryRouter.get("/:id", verifyToken, GetCategoryById);
CategoryRouter.get("/", verifyToken, GetAllCategory);
export default CategoryRouter;
