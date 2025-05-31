import User from "../models/userModel.schema.js";

export const updateUserById = async (userId, updateData) => {
  if (!userId) {
    throw new Error("không tìm thấy user");
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updateData || {}, {
    new: true,
    select: "-password -refreshToken",
  });
  if (!updatedUser) {
    throw new Error("User not found");
  }
  return updatedUser;
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
