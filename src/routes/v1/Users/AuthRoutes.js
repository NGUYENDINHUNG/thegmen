import express from "express";
import { logout, RefreshTokenUser } from "../../../Controllers/authController.js";
import { verifyToken } from "../../../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.use(verifyToken);

AuthRouter.post("/logout", logout);
AuthRouter.post("/refresh-token", RefreshTokenUser);
export default AuthRouter;
