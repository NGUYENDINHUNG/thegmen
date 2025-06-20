import express from "express";
import PermistionRouter from "#routes/v1/SuperAdmin/PermisitonRoutes.js";
import RoleRouter from "#routes/v1/SuperAdmin/RoleRoutes.js";
import userRouter from "#routes/v1/SuperAdmin/userRoutes.js";

const SuperAdminRoutes = express.Router();

SuperAdminRoutes.use("/permissions", PermistionRouter);
SuperAdminRoutes.use("/roles", RoleRouter);
SuperAdminRoutes.use("/users", userRouter);

export default SuperAdminRoutes;
