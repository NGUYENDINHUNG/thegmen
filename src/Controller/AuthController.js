import ms from "ms";
import {
  LoginUserService,
  RegisterSevice,
  processNewToken,
  handleGoogleLogin,
  handleFacebookLogin,
} from "../service/authService.js";

export const Register = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;
  const data = await RegisterSevice(email, name, password, phoneNumber);
  return res.status(data.EC === 0 ? 200 : 400).json(data);
};

export const LoginUsers = async (req, res) => {
  const { phoneNumber, password } = req.body;
  const data = await LoginUserService(phoneNumber, password);
  res.cookie("refresh_token", data.refreshToken, {
    httpOnly: true,
    maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
  });
  return res.status(200).json({
    EC: data.EC,
    EM: data.EM,
    accessToken: data.accessToken,
    user: data.user,
  });
};

export const loginSuccess = async (req, res) => {
  try {
    const data = await handleGoogleLogin(req.user);

    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });

    return res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      accessToken: data.accessToken,
      user: data.user,
    });
  } catch (err) {
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi đăng nhập Google",
      error: err.message,
    });
  }
};
export const loginFaceBookSuccess = async (req, res) => {
  try {
    const data = await handleFacebookLogin(req.user);

    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });

    return res.status(200).json({
      EC: data.EC,
      EM: data.EM,
      accessToken: data.accessToken,
      user: data.user,
    });
  } catch (err) {
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi đăng nhập FaceBook",
      error: err.message,
    });
  }
};
export const RefreshTokenUser = async (req, res) => {
  const refreshToken = req.cookies["refresh_token"];
  console.log(refreshToken);
  const result = await processNewToken(refreshToken, res);
  console.log(result);
  return res.status(200).json(result);
};
