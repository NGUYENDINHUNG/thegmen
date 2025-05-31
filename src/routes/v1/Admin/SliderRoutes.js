import express from "express";
import {
  CreateSliders,
  DeleteSlider,
  UpdateSliders,
} from "../../../controllers/sliderController.js";
import checkPermission from "../../../middleware/checkPermission.js";

const SlidersRouter = express.Router();

SlidersRouter.post(
  "/createSliders",
  checkPermission("Create_Slider"),
  CreateSliders
);

SlidersRouter.put("/:id", checkPermission("Update_Slider"), UpdateSliders);

SlidersRouter.delete("/:id", checkPermission("Delete_Slider"), DeleteSlider);
export default SlidersRouter;
