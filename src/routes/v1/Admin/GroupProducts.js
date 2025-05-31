import express from "express";
import {
  createGroupProductController,
  updateGroupProductController,
  deleteGroupProductController,
  getGroupProductByIdController,
  getAllGroupProductsController,
} from "../../../controllers/groupProductsController.js";

const GroupProductRouter = express.Router();

GroupProductRouter.post("/create", createGroupProductController);
GroupProductRouter.put("/:id", updateGroupProductController);
GroupProductRouter.delete("/:id", deleteGroupProductController);
GroupProductRouter.get("/:id", getGroupProductByIdController);
GroupProductRouter.get("/", getAllGroupProductsController);

export default GroupProductRouter;
