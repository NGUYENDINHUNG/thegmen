import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import path from "path";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import connection from "./src/config/database.js";
import userRouter from "./src/routes/userRoutes.js";
import AuthRouter from "./src/routes/AuthRoutes.js";
import CategoryRouter from "./src/routes/CategoryRoutes.js";
import SlidersRouter from "./src/routes/SliderRoutes.js";
import SupplierRouter from "./src/routes/SupplierRoutes.js";
import Addressrouter from "./src/routes/AddressRoutes.js";
import CollectionRouter from "./src/routes/ConllectionRoutes.js";
import FileRouter from "./src/routes/fileRoutes.js";
import ProductRouter from "./src/routes/ProductRoutes.js";
import VariantRouter from "./src/routes/VariantRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

//config file upload
app.use(fileUpload(), express.static("public/images"));

//view enginee
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));
app.use(express.static(path.join(__dirname, "public")));

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
