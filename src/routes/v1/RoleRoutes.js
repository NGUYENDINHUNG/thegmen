import express from "express";
import {
  createRole,
  deleteRole,
  getRole,
  updateRole,
} from "../../controllers/roleController.js";
const RoleRouter = express.Router();

RoleRouter.post("/create", createRole);
RoleRouter.get("/:id", getRole);
RoleRouter.put("/:id", updateRole);
RoleRouter.delete("/:id", deleteRole);

export default RoleRouter;
