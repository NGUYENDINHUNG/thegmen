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
  updateAccountService,
  updateAvatarService,
  updatePasswordService,
} from "../services/authService.js";
import { uploadSingleFile } from "../services/fileService.js";
import User from "../models/userModel.schema.js";

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
    if (data.EC !== 0) {
      return res.status(data.EC).json({
        statusCode: data.EC,
        message: data.EM,
      });
    }
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

    if (data.EC === 0) {
      res.cookie("refresh_token", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
      });

      const redirectUrl = `${process.env.CORS_ORIGIN}/oauth?accessToken=${data.accessToken}`;
      console.log("««««« redirectUrl »»»»»", redirectUrl);
      return res.redirect(redirectUrl);
    } else {
      return res.redirect(
        `${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(data.EM)}`
      );
    }
  } catch (err) {
    console.error("Lỗi đăng nhập Google:", err);
    return res.redirect(
      `${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(
        "Đăng nhập thất bại"
      )}`
    );
  }
};
export const loginFaceBookSuccess = async (req, res) => {
  try {
    const data = await handleFacebookLogin(req.user);

    if (data.EC === 0) {
      res.cookie("refresh_token", data.refreshToken, {
        httpOnly: true,
        maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
      });
      const redirectUrl = `${process.env.CORS_ORIGIN}?accessToken=${data.accessToken}`;
      return res.redirect(redirectUrl);
    }
    {
      return res.redirect(
        `${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(data.EM)}`
      );
    }
  } catch (err) {
    console.error("Lỗi đăng nhập Facebook:", err);
    return res.redirect(
      `${process.env.CORS_ORIGIN}/login?error=${encodeURIComponent(
        "Đăng nhập thất bại"
      )}`
    );
  }
};
export const RefreshTokenUser = async (req, res) => {
  const refreshToken = req.cookies["refresh_token"];
  const result = await processNewToken(refreshToken, res);
  return res.status(200).json(result);
};
export const getAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Không tìm thấy thông tin người dùng hoặc token đã hết hạn",
      });
    }
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "name email phoneNumber address avatar"
    );

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy thông tin người dùng thành công",
      user,
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
    if (response.EC === 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Yêu cầu đặt lại mật khẩu thành công",
        data: response,
      });
    } else {
      return res.status(404).json({
        statusCode: 404,
        message: response.EM,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
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
    return res.status(500).json({
      statusCode: 500,
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
export const updateAccount = async (req, res) => {
  const userId = req.user._id;
  const updateData = { ...(req.body || {}) };
  const oldPassword = req.body.oldPassword;

  try {
    const updatedUser = await updateAccountService(
      userId,
      updateData,
      oldPassword
    );
    res.status(200).json({
      status: 200,
      message: "Cập nhật tài khoản thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Cập nhật tài khoản thất bại",
      error: error.message,
    });
  }
};
export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("không có file được up lên.");
    } else {
      let results = await uploadSingleFile(req.files.avatar);
      imageUrl = results.path;
    }

    const updatedUser = await updateAvatarService(userId, imageUrl);

    return res.status(200).json({
      status: 200,
      message: "Cập nhật avatar thành công",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Cập nhật avatar thất bại",
      error: error.message,
    });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;
    const result = await updatePasswordService(userId, oldPassword, newPassword);
    if (result.EC !== 0) {
      return res.status(result.EC).json({
        status: result.EC,
        message: result.EM,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Cập nhật mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
