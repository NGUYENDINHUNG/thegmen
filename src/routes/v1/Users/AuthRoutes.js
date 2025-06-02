import express from "express";
import {
  logout,
  RefreshTokenUser,
  getAccount,
  requestPasswordReset,
  resetPassword,
} from "../../../controllers/authController.js";
import { verifyToken } from "../../../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/refresh-token", RefreshTokenUser);
AuthRouter.post("/forgot-password", requestPasswordReset);
AuthRouter.use(verifyToken);
AuthRouter.post("/logout", logout);
AuthRouter.get("/account", getAccount);

AuthRouter.post("/reset-password", resetPassword);
export default AuthRouter;
