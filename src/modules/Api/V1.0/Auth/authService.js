import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../../../../models/index.js";
import {
  UpdateUserRefreshToken,
  FindUserByToken,
} from "../User/userService.js";
import sendEmail from "../../../../util/email.util.js";
import ms from "ms";
const saltRounds = 10;

export const RegisterSevice = async (
  email,
  name,
  password,
  phoneNumber,
  avatar
) => {
  try {
    //check user exist
    const Usersexis = await UserModel.findOne({ email });
    if (Usersexis) {
      console.log(`Email hoặc số điện thoại đã tồn tại`);
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let result = await UserModel.create({
      email: email,
      name: name,
      password: hashPassword,
      phoneNumber: phoneNumber,
      avatar: avatar,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const LoginUserService = async (phoneNumber, password) => {
  try {
    const user = await UserModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return {
        EC: 1,
        EM: "Số Điện Thoại Không Đúng",
      };
    }
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      return {
        EC: 2,
        EM: "Mật khẩu không hợp lệ",
      };
    }

    const payload = {
      _id: user.id,
      email: user.email,
      name: user.name,
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
      user: {
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
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
  if (!profile?.id) {
    throw new Error("Không có thông tin người dùng Google");
  }

  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const name =
    profile.displayName ||
    `${profile.name?.familyName} ${profile.name?.givenName}`;
  const avatar = profile.photos?.[0]?.value;

  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.create({ googleId, email, name, avatar });
  }

  const payload = { id: user._id, email: user.email, name: user.name };
  console.log("payload", payload);
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
    user: {
      email: user.email,
      name: user.name,
    },
  };
};
export const handleFacebookLogin = async (profile) => {
  if (!profile?.id) throw new Error("Không có thông tin Facebook");

  const facebookId = profile.id;
  const email = profile.emails || "";
  const name =
    profile.displayName ||
    `${profile.name?.givenName} ${profile.name?.familyName}`;
  const avatar = profile.photos?.[0]?.value || "";
  let user = await User.findOne({ facebookId });
  if (!user) {
    user = await User.create({ facebookId, email, name, avatar });
  }

  const payload = { id: user._id, email: user.email, name: user.name };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  const refreshToken = CreateRefreshToken(payload);
  await UpdateUserRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: { email: user.email, name: user.name, avatar: user.avatar },
  };
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
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
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
    const Users = await UserModel.findOne({ email });
    if (!Users) {
      console.log(`Email ${email} không tồn tại`);
    }
    const payload = {
      _id: Users.id,
      email: Users.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_PASSWORD,
    });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    const html = `
    <h2>Hello ${Users.name || "User"},</h2>
    <p>nhấn vào link sau để đặt lại mật khẩu:</p>
    <a href="${resetLink}">${resetLink}</a>
  `;
    await sendEmail(Users.email, "Reset Your Password", html);

    return { message: "Reset link sent to email" };
  } catch (error) {
    console.error(error);
    throw new Error(error.message || "Something went wrong");
  }
};
export const resetPasswordService = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);
    if (!user) throw new Error("Người dùng không tồn tại.");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return { message: "Đặt lại mật khẩu thành công." };
  } catch (error) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn.");
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

    res.clearCookie("refresh_token");
    return res
      .status(200)
      .json({ message: "Đăng xuất thành công (cookie đã bị xóa)." });
  } catch (error) {
    throw new Error("Lỗi khi đăng xuất: " + error.message);
  }
};
