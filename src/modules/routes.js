import express from "express";
import ApiRouter from "./Api/routes.js";
const router = express.Router();

router.use("/v1/api", ApiRouter);

export default router;
