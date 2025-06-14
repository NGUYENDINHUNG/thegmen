import express from "express";
import {
  LoginUsers,
  Register,
  loginFaceBookSuccess,
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
AuthRouter.post("/request-reset-password", requestPasswordReset);
AuthRouter.post("/reset-password", resetPassword);
export default AuthRouter;
