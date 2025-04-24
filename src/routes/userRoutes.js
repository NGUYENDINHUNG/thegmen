import express from "express";
import { CreateUsers, LoginUsers } from "../Controller/UserController.js";

const userRouter = express.Router();

userRouter.post("/createUser", CreateUsers);
userRouter.post("/login", LoginUsers);

export default userRouter;
