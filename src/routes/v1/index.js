import express from "express";
import AdminRouter from "#routes/v1/Admin/index.js";
import PublicRouter from "#routes/v1/Public/index.js";
import SuperAdminRoutes from "#routes/v1/SuperAdmin/index.js";
import UserRouter from "#routes/v1/Users/index.js";

const router = express.Router();
router.use(PublicRouter);
router.use(UserRouter);
router.use(AdminRouter);
router.use(SuperAdminRoutes);

export default router;
