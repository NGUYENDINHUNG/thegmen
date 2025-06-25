import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const configExpress = (app) => {
  app.use(fileUpload());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  let corsOrigin;

  switch (process.env.NODE_ENV) {
    case "production":
      corsOrigin = [process.env.CORS_ORIGIN, "http://localhost:5173"];
      break;
    case "development":
    default:
      corsOrigin = [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5173",
      ];
  }

  const corsOptions = {
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  return app;
};

export default configExpress;
