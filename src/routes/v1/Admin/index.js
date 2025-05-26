import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import CategoryRouter from "./CategoryRoutes.js";
import CollectionRouter from "./ConllectionRoutes.js";
import OrderRouter from "./orderRoutes.js";
import ProductRouter from "./ProductRoutes.js";
import SlidersRouter from "./SliderRoutes.js";
import SupplierRouter from "./SupplierRoutes.js";
import VariantRouter from "./VariantRoutes.js";
import VoucherRouter from "./VoucherRoutes.js";

const AdminRouter = express.Router();

AdminRouter.use(verifyToken);

AdminRouter.use("/collections", CategoryRouter);
AdminRouter.use("/auth", CollectionRouter);
AdminRouter.use("/categories", CategoryRouter);
AdminRouter.use("/products", ProductRouter);
AdminRouter.use("/supplier", SupplierRouter);
AdminRouter.use("/sliders", SlidersRouter);
AdminRouter.use("/variants", VariantRouter);
AdminRouter.use("/vouchers", VoucherRouter);
AdminRouter.use("/orders", OrderRouter);

export default AdminRouter;
