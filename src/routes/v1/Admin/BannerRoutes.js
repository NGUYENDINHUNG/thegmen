import express from "express";
import {
  CreateBanner,
  DeleteBanner,
  UpdateBanner,
} from "../../../controllers/sliderController.js";
//import checkPermission from "../../../middleware/checkPermission.js";

const SlidersRouter = express.Router();

SlidersRouter.post(
  "/createSliders",
  //checkPermission("Create_Slider"),
  CreateBanner
);

SlidersRouter.put("/:id", UpdateBanner);

SlidersRouter.delete("/:id", DeleteBanner);
export default SlidersRouter;
