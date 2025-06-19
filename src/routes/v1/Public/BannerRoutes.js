import express from "express";
import { GetAllBanner } from "../../../controllers/bannerController.js";

const SlidersRouter = express.Router();

SlidersRouter.get("/getAllBanner", GetAllBanner);
export default SlidersRouter;
