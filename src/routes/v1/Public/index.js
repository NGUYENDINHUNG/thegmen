import express from "express";
import authRoutes from "#routes/v1/Public/Auth.js";
import categoryRoutes from "#routes/v1/Public/CategoryRoutes.js";
import sliderRoutes from "#routes/v1/Public/SliderRoutes.js";
import variantRoutes from "#routes/v1/Public/VariantRoutes.js";
import voucherRoutes from "#routes/v1/Public/VoucherRoutes.js";
import collectionRoutes from "#routes/v1/Public/ConllectionRoutes.js";
import productRoutes from "#routes/v1/Public/ProductRoutes.js";
import bannerRoutes from "#routes/v1/Public/BannerRoutes.js";

const PublicRouter = express.Router();
PublicRouter.use("/collections", collectionRoutes);
PublicRouter.use("/auth", authRoutes);
PublicRouter.use("/categories", categoryRoutes);
PublicRouter.use("/products", productRoutes);
PublicRouter.use("/sliders", sliderRoutes);
PublicRouter.use("/variants", variantRoutes);
PublicRouter.use("/vouchers", voucherRoutes);
PublicRouter.use("/banners", bannerRoutes);

export default PublicRouter;
