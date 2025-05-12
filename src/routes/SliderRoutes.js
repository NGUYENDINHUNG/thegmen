import express from "express";
import {
  CreateSliders,
  DeleteSlider,
  UpdateSliders,
} from "../Controller/sliderController.js";
import { verifyToken } from "../middleware/auth.js";

const SlidersRouter = express.Router();

SlidersRouter.post("/createSliders", verifyToken, CreateSliders);
SlidersRouter.put("/:id", verifyToken, UpdateSliders);
SlidersRouter.delete("/:id", verifyToken, DeleteSlider);
export default SlidersRouter;
