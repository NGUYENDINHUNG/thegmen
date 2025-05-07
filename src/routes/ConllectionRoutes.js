import express from "express";
import {
  CreateConllection,
  UpdateConllection,
  GetConllectionById,
  GetAllConllection,
  deleteConllection,
} from "../Controller/ConllectionController.js";
import verifyToken from "../middleware/auth.js";

const ConllectionRouter = express.Router();

ConllectionRouter.post("/createConllection", verifyToken, CreateConllection);
ConllectionRouter.put("/:id", verifyToken, UpdateConllection);
ConllectionRouter.get("/:id", verifyToken, GetConllectionById);
ConllectionRouter.get("/", verifyToken, GetAllConllection);
ConllectionRouter.delete("/:id", verifyToken, deleteConllection);
export default ConllectionRouter;
