import express from "express";

import "dotenv/config";
import connection from "./src/config/database.js";
import configExpress from "./src/config/express.js";
import Apirouter from "./src/routes/index.js";

const app = express();
const port = process.env.PORT || 4000;

// Log môi trường hiện tại
console.log(`Starting server in ${process.env.NODE_ENV || "development"} mode`);

//config express
configExpress(app);

// User routes
app.use(Apirouter);

// Health check endpoint với environment info
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Kết nối DB và start server
const startServer = async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.log("Error connecting to DB:", error);
  }
};
startServer();
