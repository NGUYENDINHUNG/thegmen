import express from "express";
import {
  createRole,
  deleteRole,
  getRole,
  updateRole,
} from "#controllers/roleController.js";
const RoleRouter = express.Router();

RoleRouter.post("/create", createRole);
RoleRouter.get("/:roleId", getRole);
RoleRouter.put("/:roleId", updateRole);
RoleRouter.delete("/:roleId", deleteRole);

export default RoleRouter;
