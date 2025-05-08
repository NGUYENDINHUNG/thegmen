import { uploadSingleFile } from "../service/fileService.js";
import {
  CreateUsersService,
  GetUserById,
  updateUserById,
} from "../service/userService.js";

export const CreateUsers = async (req, res) => {
  const { email, name, password, phoneNumber } = req.body;
  const data = await CreateUsersService(email, name, password, phoneNumber);
  return res.status(200).json(data);
};

export const UserFindById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await GetUserById(userId);
    if (!user) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy người dùng",
      });
    }
    return res.status(200).json({
      EC: 0,
      EM: "Lấy thông tin người dùng thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const updatedUser = await updateUserById(userId, updateData);

    res.status(200).json({
      message: "cập nhật ngươi dùng thành công",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "k tìm thấy ngươif dùng") {
      return res.status(404).json({ message: error.message });
    }
  }
};
