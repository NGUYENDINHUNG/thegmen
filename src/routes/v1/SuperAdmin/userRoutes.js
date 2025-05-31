import express from "express";
import { 
  updateUserBySuperAdmin, 
  getAllUsers, 
  getUserById, 
  deleteUser 
} from "../../../Controllers/userController.js";
import { verifyToken } from "../../../middleware/auth.js";
import checkPermission from "../../../middleware/checkPermission.js";

const userRouter = express.Router();

// Apply verifyToken middleware to all routes
userRouter.use(verifyToken);

// Get all users
userRouter.get("/", checkPermission("View_Users"), getAllUsers);

// Get user by ID
userRouter.get("/:userId", checkPermission("View_Users"), getUserById);

// Update user
userRouter.put("/:userId", checkPermission("Update_Users"), updateUserBySuperAdmin);

// Delete user
userRouter.delete("/:userId", checkPermission("Delete_Users"), deleteUser);

export default userRouter;
