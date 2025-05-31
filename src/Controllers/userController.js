import User from "../models/userModel.schema.js";
import { uploadSingleFile } from "../services/fileService.js";
import { updateUserById } from "../services/userService.js";

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = { ...(req.body || {}) };
  try {
    if (req.files && req.files.avatar) {
      const uploadResult = await uploadSingleFile(req.files.avatar);
      if (uploadResult.status === "success") {
        updateData.avatar = uploadResult.path;
      } else {
        return res.status(500).json({
          message: "Upload avatar thất bại",
          error: uploadResult.error,
        });
      }
    }
    const updatedUser = await updateUserById(userId, updateData);
    res.status(200).json({
      status: 200,
      message: "Cập nhật người dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Cập nhật người dùng thất bại",
      error: error.message,
    });
  }
};

// Get all users (for superAdmin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -refreshToken");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get user by ID (for superAdmin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Update user by ID (for superAdmin)
export const updateUserBySuperAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const updatedUser = await updateUserById(userId, updateData);
    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

// Delete user (for superAdmin)
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
