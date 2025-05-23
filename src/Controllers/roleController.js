import {
  createRoleService,
  getRoleService,
  updateRoleService,
  deleteRoleService,
} from "../services/roleService.js";

export const createRole = async (req, res) => {
  try {
    const roleData = req.body;
    const role = await createRoleService(roleData);
    return res.status(200).json({
      statusCode: 200,
      message: "Tạo vai trò thành công",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Tạo vai trò thất bại",
      error: error,
    });
  }
};

export const getRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await getRoleService(roleId);
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy vai trò thành công",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy vai trò thất bại",
      error: error,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const roleData = req.body;
    const role = await updateRoleService(roleId, roleData);
    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật vai trò thành công",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Cập nhật vai trò thất bại",
      error: error,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const role = await deleteRoleService(roleId);
    return res.status(200).json({
      statusCode: 200,
      message: "Xóa vai trò thành công",
      data: role,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa vai trò thất bại",
      error: error,
    });
  }
};
