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
// import { errorConverter, errorHandler } from "./middleware/errorHandler.js";
// import ApiError from "./helpers/apiError.js";

// Import routes
import router from "./modules/routes.js";

const app = express();
const port = process.env.PORT || 4000;

//config file upload
app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use(router);

// Handle 404
// app.use((req, res, next) => {
//   next(new ApiError(404, `Cannot find ${req.originalUrl} on this server!`));
// });

// Error handling middleware
// app.use(errorConverter);
// app.use(errorHandler);

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
