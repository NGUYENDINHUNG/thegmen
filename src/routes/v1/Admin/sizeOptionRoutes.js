import express from "express";
import {
  createSizeOptionController,
  updateSizeOptionController,
  deleteSizeOptionController,
  getSizeOptionByIdController,
  getAllSizeOptionsController,
} from "../../../controllers/sizeOptionController.js";

const SizeOptionRouter = express.Router();

SizeOptionRouter.post("/createSizeOption", createSizeOptionController);

SizeOptionRouter.put("/:id", updateSizeOptionController);

SizeOptionRouter.delete("/:id", deleteSizeOptionController);

SizeOptionRouter.get("/:id", getSizeOptionByIdController);

SizeOptionRouter.get("/", getAllSizeOptionsController);

export default SizeOptionRouter;
