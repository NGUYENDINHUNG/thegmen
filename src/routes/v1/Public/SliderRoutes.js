import express from "express";
import { GetAllSliders } from "../../../controllers/sliderController.js";

const SlidersRouter = express.Router();

SlidersRouter.get("/getAllSliders", GetAllSliders);
export default SlidersRouter;
