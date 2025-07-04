import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  updatePermission,
} from "../../../controllers/permissionController.js";

const PermissionRouter = express.Router();

PermissionRouter.post("/create", createPermission);
PermissionRouter.get("/", getAllPermissions);
PermissionRouter.get("/:permissionId", getPermission);
PermissionRouter.put("/:permissionId", updatePermission);
PermissionRouter.delete("/:permissionId", deletePermission);

export default PermissionRouter;
