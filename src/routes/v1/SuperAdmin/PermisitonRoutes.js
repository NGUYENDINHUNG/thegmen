import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  updatePermission,
} from "../../../controllers/permisitionController.js";

const PermistionRouter = express.Router();

PermistionRouter.post("/create", createPermission);
PermistionRouter.get("/", getAllPermissions);
PermistionRouter.get("/:permissionId", getPermission);
PermistionRouter.put("/:permissionId", updatePermission);
PermistionRouter.delete("/:permissionId", deletePermission);

export default PermistionRouter;
