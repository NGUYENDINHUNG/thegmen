import { uploadSingleFile } from "../FileUpload/fileService.js";
import { updateUserById } from "./userService.js";

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

    // Cập nhật user
    const updatedUser = await updateUserById(userId, updateData);

    res.status(200).json({
      status: 200,
      message: "Cập nhật người dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
  }
};
