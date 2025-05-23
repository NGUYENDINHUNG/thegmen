import express from "express";
import authRoutes from "../routes/v1/AuthRoutes.js";
import userRoutes from "../routes/v1/userRoutes.js";
import productRoutes from "../routes/v1/ProductRoutes.js";
import categoryRoutes from "../routes/v1/CategoryRoutes.js";
import cartRoutes from "../routes/v1/CartRoutes.js";
import orderRoutes from "../routes/v1/orderRoutes.js";
import addressRoutes from "../routes/v1/AddressRoutes.js";
import collectionRoutes from "../routes/v1/ConllectionRoutes.js";
import fileRoutes from "../routes/v1/fileRoutes.js";
import sliderRoutes from "../routes/v1/SliderRoutes.js";
import supplierRoutes from "../routes/v1/SupplierRoutes.js";
import variantRoutes from "../routes/v1/VariantRoutes.js";
import voucherRoutes from "../routes/v1/VoucherRoutes.js";
import PermistionRouter from "./v1/PermisitonRoutes.js";
import RoleRouter from "./v1/RoleRoutes.js";

const ApiRouter = express.Router();

// API v1 routes
ApiRouter.use("/auth", authRoutes);
ApiRouter.use("/users", userRoutes);
ApiRouter.use("/products", productRoutes);
ApiRouter.use("/categories", categoryRoutes);
ApiRouter.use("/cart", cartRoutes);
ApiRouter.use("/orders", orderRoutes);
ApiRouter.use("/addresses", addressRoutes);
ApiRouter.use("/collections", collectionRoutes);
ApiRouter.use("/files", fileRoutes);
ApiRouter.use("/sliders", sliderRoutes);
ApiRouter.use("/suppliers", supplierRoutes);
ApiRouter.use("/variants", variantRoutes);
ApiRouter.use("/vouchers", voucherRoutes);
ApiRouter.use("/permissions", PermistionRouter);
ApiRouter.use("/roles", RoleRouter);

export default ApiRouter;
