import express from "express";
import { updateUser } from "../Controller/userController.js";
import { verifyToken } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.put("/updateUser/:userId", verifyToken, updateUser);

export default userRouter;
