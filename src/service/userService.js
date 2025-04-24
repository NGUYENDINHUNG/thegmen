import User from "../model/userModel.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;

export const CreateUsersService = async (
  email,
  name,
  password,
  phoneNumber
) => {
  try {
    //check user exist
    const Usersexis = await User.findOne({ email });
    if (Usersexis) {
      console.log(`Email ${email} đã tồn tại`);
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);

    let result = await User.create({
      email: email,
      name: name,
      password: hashPassword,
      phoneNumber: phoneNumber,
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const LoginUserService = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: " mật khẩu không hợp lệ",
        };
      } else {
        const payload = {
          _id: user.id,
          email: user.email,
          name: user.name,
        };
        const refreshToken = CreateRefreshToken(payload);
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });

        return {
          EC: 0,
          EM: "Đăng nhập thành công",
          accessToken,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email không hợp lệ",
      };
    }
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return {
      EC: 500,
      EM: "Email hoặc mật khẩu của bạn sai",
    };
  }
};

export const CreateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

export const UpdateUserRefreshToken = async (refreshToken, _id) => {
  await User.updateOne({ _id }, { refreshToken });
};
