import express from "express";
import { logout, RefreshTokenUser } from "../../../Controllers/authController.js";
import { verifyToken } from "../../../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/refresh-token", RefreshTokenUser);
AuthRouter.use(verifyToken);
AuthRouter.post("/logout", logout);
export default AuthRouter;
 