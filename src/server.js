import express from "express";
import "dotenv/config";
import connection from "./config/database.js";
import configExpress from "./config/express.js";
import Apirouter from "./routes/index.js";

const app = express();
const port = process.env.PORT || 4000;

//config express
configExpress(app);

// User routes
app.use(Apirouter);

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
