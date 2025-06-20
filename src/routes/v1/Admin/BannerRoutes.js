import express from "express";
import {
  CreateBanner,
  DeleteBanner,
  UpdateBanner,
} from "../../../controllers/bannerController.js";
//import checkPermission from "../../../middleware/checkPermission.js";

const BannerRouter = express.Router();

BannerRouter.post(
  "/createBanners",
  //checkPermission("Create_Slider"),
  CreateBanner
);

BannerRouter.put("/:id", UpdateBanner);

BannerRouter.delete("/:id", DeleteBanner);
export default BannerRouter;
