import User from "../models/userModel.schema.js";

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
 
