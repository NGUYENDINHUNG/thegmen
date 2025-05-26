import express from "express";
import authRoutes from "./Auth.js";
import categoryRoutes from "./CategoryRoutes.js";
import sliderRoutes from "./SliderRoutes.js";
import variantRoutes from "./VariantRoutes.js";
import voucherRoutes from "./VoucherRoutes.js";
import collectionRoutes from "./ConllectionRoutes.js";
import productRoutes from "./ProductRoutes.js";

const PublicRouter = express.Router();
PublicRouter.use("/collections", collectionRoutes);
PublicRouter.use("/auth", authRoutes);
PublicRouter.use("/categories", categoryRoutes);
PublicRouter.use("/products", productRoutes);
PublicRouter.use("/sliders", sliderRoutes);
PublicRouter.use("/variants", variantRoutes);
PublicRouter.use("/vouchers", voucherRoutes);

export default PublicRouter;
