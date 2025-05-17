import ms from "ms";
import {
  LoginUserService,
  RegisterSevice,
  processNewToken,
  handleGoogleLogin,
  handleFacebookLogin,
  ForgetPasswordService,
  resetPasswordService,
  LogoutService,
} from "../../../services/authService.js";
import { uploadSingleFile } from "../../../services/fileService.js";

export const Register = async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    } else {
      let results = await uploadSingleFile(req.files.avatar);
      imageUrl = results.path;
    }
    const data = await RegisterSevice(
      email,
      name,
      password,
      phoneNumber,
      imageUrl
    );
    return res.status(200).json({
      statusCode: 200,
      message: "Register successfully",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Register failed",
      error: error.message,
    });
  }
};

export const LoginUsers = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const data = await LoginUserService(phoneNumber, password);
    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });
    return res.status(200).json({
      statusCode: 200,
      message: "Login successfully",
      accessToken: data.accessToken,
      user: data.user,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const loginGoogleSuccess = async (req, res) => {
  try {
    const data = await handleGoogleLogin(req.user);

    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Login successfully",
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
export const getAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Không tìm thấy thông tin người dùng hoặc token đã hết hạn",
      });
    }

    return res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await ForgetPasswordService(email);
    return res.json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await resetPasswordService(token, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    await LogoutService(refreshToken, res);
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ message: "Đăng xuất thất bại." });
  }
};
