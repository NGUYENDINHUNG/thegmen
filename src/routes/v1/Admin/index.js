import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import CategoryRouter from "./CategoryRoutes.js";
import CollectionRouter from "./ConllectionRoutes.js";
import OrderRouter from "./orderRoutes.js";
import ProductRouter from "./ProductRoutes.js";
import SlidersRouter from "./SliderRoutes.js";
import VariantRouter from "./VariantRoutes.js";
import VoucherRouter from "./VoucherRoutes.js";
import FileRouter from "./fileRoutes.js";

import AuthRouter from "../Public/Auth.js";
import BannerRouter from "./BannerRoutes.js";

const AdminRouter = express.Router();

AdminRouter.use(verifyToken);

AdminRouter.use("/collections", CollectionRouter);
AdminRouter.use("/auth", AuthRouter);
AdminRouter.use("/categories", CategoryRouter);
AdminRouter.use("/products", ProductRouter);
AdminRouter.use("/sliders", SlidersRouter);
AdminRouter.use("/variants", VariantRouter);
AdminRouter.use("/vouchers", VoucherRouter);
AdminRouter.use("/orders", OrderRouter);
AdminRouter.use("/files", FileRouter);
AdminRouter.use("/banners", BannerRouter);

export default AdminRouter;
