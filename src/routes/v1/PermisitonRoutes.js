import express from "express";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  updatePermission,
} from "../../controllers/permisitionController.js";

const PermistionRouter = express.Router();

PermistionRouter.post("/create", createPermission);
PermistionRouter.get("/", getAllPermissions);
PermistionRouter.get("/:id", getPermission);
PermistionRouter.put("/:id", updatePermission);
PermistionRouter.delete("/:id", deletePermission);

export default PermistionRouter;
