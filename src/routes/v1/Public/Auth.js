import express from "express";
import {
  LoginUsers,
  Register,
  loginGoogleSuccess,
  requestPasswordReset,
  resetPassword,
} from "../../../controllers/authController.js";  
import passport from "../../../config/passport.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", Register);
AuthRouter.post("/login", LoginUsers);
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
AuthRouter.post("/request-reset-password", requestPasswordReset);
AuthRouter.post("/reset-password", resetPassword);
export default AuthRouter;
