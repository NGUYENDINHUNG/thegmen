import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import connection from "./config/database.js";
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
