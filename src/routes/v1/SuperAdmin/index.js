import express from "express";
import PermistionRouter from "./PermisitonRoutes.js";
import RoleRouter from "./RoleRoutes.js";
import userRouter from "./userRoutes.js";

const SuperAdminRoutes = express.Router();

SuperAdminRoutes.use("/permissions", PermistionRouter);
SuperAdminRoutes.use("/roles", RoleRouter);
SuperAdminRoutes.use("/users", userRouter);

export default SuperAdminRoutes;
