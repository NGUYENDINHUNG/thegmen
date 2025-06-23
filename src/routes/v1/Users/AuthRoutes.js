import express from "express";
import {
  logout,
  RefreshTokenUser,
  getAccount,
  requestPasswordReset,
  resetPassword,
  updateAccount,
  updateAvatar,
  updatePassword,
} from "../../../controllers/authController.js";
import { verifyToken } from "../../../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/refresh-token", RefreshTokenUser);
AuthRouter.post("/forgot-password", requestPasswordReset);
AuthRouter.use(verifyToken);
AuthRouter.post("/logout", logout);
AuthRouter.get("/account", getAccount);
AuthRouter.put("/update-account", updateAccount);
AuthRouter.put("/update-avatar", updateAvatar);
AuthRouter.post("/reset-password", resetPassword);
AuthRouter.put("/update-password", updatePassword);
export default AuthRouter;
