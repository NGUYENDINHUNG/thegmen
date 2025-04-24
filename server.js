import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connection from "./src/config/database.js";
import userRouter from "./src/routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Test route
app.get("/", (req, res) => {
  res.json("hello");
});

// User routes
app.use("/v1/api/user", userRouter);

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
