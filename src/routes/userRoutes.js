import express from "express";
import {
  CreateUsers,
  UserFindById,
  updateUser,
} from "../Controller/UserController.js";
import verifyToken from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/createUser", CreateUsers);
userRouter.get("/:id", verifyToken, UserFindById);
userRouter.patch("/:id", verifyToken, updateUser);
export default userRouter;
