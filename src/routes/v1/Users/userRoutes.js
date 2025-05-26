import express from "express";
import { updateUser } from "../../../Controllers/userController.js";
import { verifyToken } from "../../../middleware/auth.js";
const userRouter = express.Router();

userRouter.use(verifyToken);
userRouter.put("/updateUser/:userId", updateUser);

export default userRouter;
