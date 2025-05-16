import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connection from "./config/database.js";
import userRouter from "./routes/userRoutes.js";
import AuthRouter from "./routes/AuthRoutes.js";
import CategoryRouter from "./routes/categoryRoutes.js";
import SlidersRouter from "./routes/SliderRoutes.js";
import SupplierRouter from "./routes/SupplierRoutes.js";
import Addressrouter from "./routes/addressRoutes.js";
import CollectionRouter from "./routes/conllectionRoutes.js";
import FileRouter from "./routes/fileRoutes.js";
import ProductRouter from "./routes/productRoutes.js";
import VariantRouter from "./routes/variantRoutes.js";
import Cartrouter from "./routes/cartRoutes.js";
import VoucherRouter from "./routes/voucherRoutes.js";
import OrderRouter from "./routes/orderRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

//config file upload
app.use(fileUpload());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// User routes
app.use("/v1/api/auth", AuthRouter);
app.use("/v1/api/user", userRouter);
app.use("/v1/api/category", CategoryRouter);
app.use("/v1/api/sliders", SlidersRouter);
app.use("/v1/api/suppliers", SupplierRouter);
app.use("/v1/api/address", Addressrouter);
app.use("/v1/api/collection", CollectionRouter);
app.use("/v1/api/upload", FileRouter);
app.use("/v1/api/product", ProductRouter);
app.use("/v1/api/variant", VariantRouter);
app.use("/v1/api/cart", Cartrouter);
app.use("/v1/api/voucher", VoucherRouter);
app.use("/v1/api/order", OrderRouter);

// Kết nối DB và start server
const startServer = async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(` Server started at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(" Error connecting to DB:", error);
  }
};
startServer();
