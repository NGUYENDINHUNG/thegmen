import express from "express";
import {
  DeleteSlider,
  UpdateSliders,
} from "../../../Controllers/sliderController.js";


const SlidersRouter = express.Router();

SlidersRouter.put("/:id", UpdateSliders);
SlidersRouter.delete("/:id", DeleteSlider);
export default SlidersRouter;
