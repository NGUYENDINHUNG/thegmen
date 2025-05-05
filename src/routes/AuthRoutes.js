import express from "express";
import {
  LoginUsers,
  Register,
  RefreshTokenUser,
  loginSuccess,
  loginFaceBookSuccess,
  requestPasswordReset,
  resetPassword,
  logout,
} from "../Controller/AuthController.js";
import verifyToken from "../middleware/auth.js";
import passport from "../config/passport.js";

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
AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  loginSuccess
);

AuthRouter.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

AuthRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  loginFaceBookSuccess
);

AuthRouter.post("/forgot-password", requestPasswordReset);
AuthRouter.post("/reset-password", resetPassword);
AuthRouter.post("/logout", verifyToken, logout);
export default AuthRouter;
