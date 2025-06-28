import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/userModel.schema.js";
import { UpdateUserRefreshToken, FindUserByToken } from "../services/userService.js";
import sendEmail from "../util/email.util.js";
import ms from "ms";
import Role from "../models/roleModel.schema.js";
const saltRounds = 10;

export const RegisterSevice = async (
  email,
  name,
  password,
  phoneNumber,
  avatar,
  role
) => {
  try {
    const emailsexis = await User.findOne({ email });
    const phoneNumbersexis = await User.findOne({ phoneNumber });
    if (emailsexis) {
      return {
        EC: 1,
        EM: "Email  đã tồn tại",
      };
    }
    if (phoneNumbersexis) {
      return {
        EC: 2,
        EM: "Số điện thoại đã tồn tại",
      };
    }
    let roleId = role;
    if (!roleId) {
      const userRole = await Role.findOne({ name: "USER" });
      roleId = userRole._id;
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let result = await User.create({
      email: email,
      name: name,
      password: hashPassword,
      phoneNumber: phoneNumber,
      avatar: avatar,
      role: roleId,
    });
    return {
      EC: 0,
      EM: "đăng kí thành công",
      data: result,
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "đăng kí thất bại",
    };
  }
};
export const LoginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return {
        EC: 1,
        EM: "Email hoặc mật khẩu không đúng",
      };
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Email hoặc mật khẩu không đúng",
      };
    }
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      avatar: user.avatar,
    };
    const refreshToken = CreateRefreshToken(payload);
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    await UpdateUserRefreshToken(user._id, refreshToken);
    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại",
    };
  }
};
export const handleGoogleLogin = async (profile) => {
  try {
    if (!profile?.id) {
      throw new Error("Không có thông tin người dùng Google");
    }
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name =
      profile.displayName ||
      `${profile.name?.familyName} ${profile.name?.givenName}`;
    const avatar = profile.photos?.[0]?.value;

    const userRole = await Role.findOne({ name: "USER" });

    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar,
        role: userRole?._id,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      avatar: user.avatar,
    };
    const refreshToken = CreateRefreshToken(payload);
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    await UpdateUserRefreshToken(user._id, refreshToken);

    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại",
    };
  }
};
export const handleFacebookLogin = async (profile) => {
  try {
    if (!profile?.id) throw new Error("Không có thông tin Facebook");

    const facebookId = profile.id;
    const email = profile.emails || "";
    const name =
      profile.displayName ||
      `${profile.name?.givenName} ${profile.name?.familyName}`;
    const avatar = profile.photos?.[0]?.value || "";
    const userRole = await Role.findOne({ name: "USER" });
    let user = await User.findOne({ facebookId });
    if (!user) {
      user = await User.create({
        facebookId,
        email,
        name,
        avatar,
        role: userRole?._id,
      });
    }
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      avatar: user.avatar,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const refreshToken = CreateRefreshToken(payload);
    await UpdateUserRefreshToken(user._id, refreshToken);

    return {
      EC: 0,
      EM: "Đăng nhập thành công",
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại",
    };
  }
};
export const CreateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};
export const processNewToken = async (refreshToken, res) => {
  try {
    if (!refreshToken) {
      return {
        EC: 401,
        EM: "Không tìm thấy refresh token",
      };
    }

    const user = await FindUserByToken(refreshToken);

    if (!user) {
      return {
        EC: 1,
        EM: "Không tìm thấy người dùng với token này",
      };
    }

    const { _id, name, email, phoneNumber } = user;
    const newPayload = {
      _id,
      name,
      email,
      phoneNumber,
    };

    const accessToken = jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const new_refresh_token = CreateRefreshToken(newPayload);

    res.clearCookie("refresh_token");

    const updateResult = await UpdateUserRefreshToken(
      user._id,
      new_refresh_token
    );
    if (!updateResult) {
      return {
        EC: 2,
        EM: "Không thể cập nhật refresh token",
      };
    }
    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE),
    });
    return {
      EC: 0,
      EM: "Làm mới token thành công",
      accessToken,
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);

    if (error.name === "TokenExpiredError") {
      return {
        EC: 401,
        EM: "Refresh token đã hết hạn, vui lòng đăng nhập lại",
      };
    }

    if (error.name === "JsonWebTokenError") {
      return {
        EC: 401,
        EM: "Refresh token không hợp lệ, vui lòng đăng nhập lại",
      };
    }

    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra: " + error.message,
    };
  }
};
export const ForgetPasswordService = async (email) => {
  try {
    const Users = await User.findOne({ email });
    if (!Users) {
      return {
        EC: 1,
        EM: "Email không tồn tại",
      };
    }
    if (Users.googleId || Users.facebookId) {
      return {
        EC: 1,
        EM: "Tài khoản đăng nhập bằng bên thứ 3 không thể sử dụng chức năng quên mật khẩu",
      };
    }
    const payload = {
      _id: Users.id,
      email: Users.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_PASSWORD,
    });
    const resetLink = `${process.env.CORS_ORIGIN}/reset-password?token=${token}`;
    const html = `
    <h2>Hello ${Users.name || "User"},</h2>
    <p>nhấn vào link sau để đặt lại mật khẩu:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;
    await sendEmail(Users.email, "Reset Your Password", html);

    return {
      EC: 0,
      EM: "Link đặt lại mật khẩu đã được gửi đến email",
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại",
    };
  }
};
export const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return {
        EC: 1,
        EM: "Người dùng không tồn tại.",
      };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return {
      EC: 0,
      EM: "Đặt lại mật khẩu thành công.",
    };
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại",
    };
  }
};
export const LogoutService = async (refreshToken, res) => {
  try {
    if (!refreshToken) {
      res.clearCookie("refresh_token");
      return res
        .status(200)
        .json({ message: "Không có token, nhưng đã xóa cookie." });
    }
    const user = await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      { refreshToken: null },
      { new: true }
    );
    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    }
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    throw new Error("Lỗi khi đăng xuất: " + error.message);
  }
};
export const updateAccountService = async (userId, updateData) => {
  if (!userId) throw new Error("Không tìm thấy user");
  delete updateData.role;
  delete updateData.permission;
  delete updateData.password;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData || {}, {
    new: true,
    select: "-password -refreshToken",
  });
  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
};
export const updateAvatarService = async (userId, imageUrl) => {
  if (!userId) throw new Error("Không tìm thấy user");
  if (!imageUrl) throw new Error("Thiếu đường dẫn avatar");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar: imageUrl },
    { new: true, select: "name email phoneNumber address avatar" }
  );
  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
};
export const updatePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  if (!userId) throw new Error("Không tìm thấy user");
  if (!oldPassword) throw new Error("Thiếu mật khẩu cũ");
  if (!newPassword) throw new Error("Thiếu mật khẩu mới");
  if (oldPassword === newPassword)
    throw new Error("Mật khẩu cũ và mới không được giống nhau");
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User không tồn tại");

  if (!user.password) {
    throw new Error(
      "Tài khoản của bạn đăng nhập bằng bên thứ 3, không thể đổi mật khẩu."
    );
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Mật khẩu cũ không đúng");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  return { message: "Cập nhật mật khẩu thành công" };
};
