import express from "express";
import { verifyToken } from "#middleware/auth.js";
import CategoryRouter from "#routes/v1/Admin/CategoryRoutes.js";
import CollectionRouter from "#routes/v1/Admin/ConllectionRoutes.js";
import OrderRouter from "#routes/v1/Admin/orderRoutes.js";
import ProductRouter from "#routes/v1/Admin/ProductRoutes.js";
import SlidersRouter from "#routes/v1/Admin/SliderRoutes.js";
import VariantRouter from "#routes/v1/Admin/VariantRoutes.js";
import VoucherRouter from "#routes/v1/Admin/VoucherRoutes.js";
import FileRouter from "#routes/v1/Admin/fileRoutes.js";
import BannerRouter from "#routes/v1/Admin/BannerRoutes.js";

const AdminRouter = express.Router();

AdminRouter.use(verifyToken);

AdminRouter.use("/collections", CollectionRouter);
AdminRouter.use("/categories", CategoryRouter);
AdminRouter.use("/products", ProductRouter);
AdminRouter.use("/sliders", SlidersRouter);
AdminRouter.use("/variants", VariantRouter);
AdminRouter.use("/vouchers", VoucherRouter);
AdminRouter.use("/orders", OrderRouter);
AdminRouter.use("/files", FileRouter);
AdminRouter.use("/banners", BannerRouter);

export default AdminRouter;
