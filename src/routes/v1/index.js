import express from "express";
import AdminRouter from "./Admin/index.js";
import PublicRouter from "./Public/index.js";
import SuperAdminRoutes from "./SuperAdmin/index.js";
import UserRouter from "./Users/index.js";

const router = express.Router();
router.use(PublicRouter);
router.use(UserRouter);
router.use(AdminRouter);
router.use(SuperAdminRoutes);

export default router;
