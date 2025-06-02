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
} from "../services/authService.js";
import { uploadSingleFile } from "../services/fileService.js";

export const Register = async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("không có file được up lên.");
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
    if (data.EC === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Đăng ký thành công",
        data: data,
      });
    } else {
      return res.status(400).json({
        statusCode: 400,
        message: data.EM,
      });
    }
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Đăng ký thất bại. Vui lòng thử lại sau.",
      error: error.message,
    });
  }
};
export const LoginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await LoginUserService(email, password);
    res.cookie("refresh_token", data.refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });
    if (data.EC === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Login successfully",
        accessToken: data.accessToken,
      });
    } else {
      return res.status(500).json({
        statusCode: 500,
        message: data.EM,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Đăng nhập thất bại",
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
      statusCode: 200,
      message: "Đăng nhập thành công",
      accessToken: data.accessToken,
      user: data.user,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Đăng nhập thất bại",
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
    const { name, email, phoneNumber, address, avatar } = req.user;
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy thông tin người dùng thành công",
      user: {
        name,
        email,
        phoneNumber,
        address,
        avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await ForgetPasswordService(email);
    return res.status(200).json({
      statusCode: 200,
      message: "Yêu cầu đặt lại mật khẩu thành công",
      data: response,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const result = await resetPasswordService(token, newPassword);
    return res.status(200).json({
      statusCode: 200,
      message: "Đặt lại mật khẩu thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies["refresh_token"];
    await LogoutService(refreshToken, res);
    return res.status(200).json({
      statusCode: 200,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Đăng xuất thất bại.",
      error: error.message,
    });
  }
};
