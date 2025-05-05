import User from "../model/userModel.schema.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

export const CreateUsersService = async (
  email,
  name,
  password,
  phoneNumber
) => {
  try {
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

export const GetUserById = async (userId) => {
  try {
    if (!userId) {
      return null;
    }
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Lỗi khi tìm user theo ID:", error);
    throw error;
  }
};

export const updateUserById = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
export const UpdateUserRefreshToken = async (userId, refreshToken) => {
  try {
    const result = await User.findByIdAndUpdate(
      userId,
      { refreshToken: refreshToken },
      { new: true }
    );
    return result;
  } catch (error) {
    console.log("Lỗi khi cập nhật refresh token:", error);
    return null;
  }
};
export const FindUserByToken = async (refreshToken) => {
  try {
    const UserByToken = await User.findOne({ refreshToken });
    return UserByToken;
  } catch (error) {
    console.error("Error finding user by token:", error);
    throw error;
  }
};


