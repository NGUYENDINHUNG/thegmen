import express from "express";
import { logout, RefreshTokenUser ,getAccount } from "../../../controllers/authController.js";
import { verifyToken } from "../../../middleware/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/refresh-token", RefreshTokenUser);
AuthRouter.use(verifyToken);
AuthRouter.post("/logout", logout);
AuthRouter.get("/account", getAccount);
export default AuthRouter;
 