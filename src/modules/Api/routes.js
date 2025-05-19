import express from "express";
import Addressrouter from "./V1.0/Address/addressRoutes.js";
import AuthRouter from "./V1.0/Auth/authRoutes.js";
import CategoryRouter from "./V1.0/Category/categoryRoutes.js";
import CollectionRouter from "./V1.0/Conllection/conllectionRoutes.js";
import FileRouter from "./V1.0/FileUpload/fileRoutes.js";
import ProductRouter from "./V1.0/Products/productRoutes.js";
import SliderRouter from "./V1.0/Sliders/sliderRoutes.js";
import SupplierRouter from "./V1.0/Suppliers/supplierRoutes.js";
import UserRouter from "./V1.0/User/userRoutes.js";
import VariantRouter from "./V1.0/Variants/variantRoutes.js";
import Cartrouter from "./V1.0/Carts/cartRoutes.js";
import VoucherRouter from "./V1.0/Vouchers/voucherRoutes.js";
import OrderRouter from "./V1.0/Orders/orderRoutes.js";
import verifyToken from "../../middleware/auth.js";

const ApiRouter = express.Router();

ApiRouter.use("/auth", AuthRouter);

ApiRouter.use(verifyToken);

ApiRouter.use("/address", Addressrouter);
ApiRouter.use("/category", CategoryRouter);
ApiRouter.use("/collection", CollectionRouter);
ApiRouter.use("/file", FileRouter);
ApiRouter.use("/product", ProductRouter);
ApiRouter.use("/slider", SliderRouter);
ApiRouter.use("/supplier", SupplierRouter);
ApiRouter.use("/user", UserRouter);
ApiRouter.use("/variant", VariantRouter);
ApiRouter.use("/cart", Cartrouter);
ApiRouter.use("/voucher", VoucherRouter);
ApiRouter.use("/order", OrderRouter);

export default ApiRouter;
