import express from "express";
import {
  CreateSliders,
  DeleteSlider,
  UpdateSliders,
} from "./sliderController.js";

const SlidersRouter = express.Router();

SlidersRouter.post("/createSliders", CreateSliders);
SlidersRouter.put("/:id", UpdateSliders);
SlidersRouter.delete("/:id", DeleteSlider);
export default SlidersRouter;
