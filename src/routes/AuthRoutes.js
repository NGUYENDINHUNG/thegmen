import express from "express";
import {
  LoginUsers,
  Register,
  RefreshTokenUser,
} from "../Controller/AuthController.js";
import verifyToken from "../middleware/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", Register);
AuthRouter.post("/login", LoginUsers);
AuthRouter.get("/account", verifyToken, async (req, res) => {
  return res.status(200).json({
    message: "Lấy thông tin người dùng thành công",
    user: req.user,
  });
});
AuthRouter.get("/refreshToken", RefreshTokenUser);
export default AuthRouter;
