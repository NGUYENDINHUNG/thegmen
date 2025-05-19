import express from "express";
import {
  LoginUsers,
  Register,
  RefreshTokenUser,
  loginFaceBookSuccess,
  requestPasswordReset,
  resetPassword,
  logout,
  getAccount,
  loginGoogleSuccess,
} from "./authController.js";
import passport from "../../../../config/passport.js";
import verifyToken from "../../../../middleware/auth.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", Register);
AuthRouter.post("/login", LoginUsers);
AuthRouter.get("/account", getAccount);
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
  loginGoogleSuccess
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
