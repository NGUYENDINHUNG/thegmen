import express from "express";
import { updateUser } from "./userController.js";

const userRouter = express.Router();

userRouter.put("/updateUser/:userId", updateUser);

export default userRouter;
