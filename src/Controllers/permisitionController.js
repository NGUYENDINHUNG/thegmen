import {
  createPermissionService,
  getPermissionService,
  updatePermissionService,
  deletePermissionService,
  GetAllPermissionsService,
} from "../services/permisition.js";

export const createPermission = async (req, res) => {
  try {
    const permissionData = req.body;

    const permission = await createPermissionService(permissionData);

    return res.status(200).json({
      statusCode: 200,
      message: "Tạo quyền thành công",
      data: permission,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Tạo quyền thất bại",
      error: error,
    });
  }
};

export const getPermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const permission = await getPermissionService(permissionId);
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy quyền thành công",
      data: permission,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy quyền thất bại",
      error: error,
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    console.log(permissionId);
    const permissionData = req.body;
    const permission = await updatePermissionService(
      permissionId,
      permissionData
    );
    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật quyền thành công",
      data: permission,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Cập nhật quyền thất bại",
      error: error,
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const permission = await deletePermissionService(permissionId);
    return res.status(200).json({
      statusCode: 200,
      message: "Xóa quyền thành công",
      data: permission,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa quyền thất bại",
      error: error,
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const { pageSize, currentPage } = req.query;
    const permissions = await GetAllPermissionsService(pageSize, currentPage);
    if (!permissions || permissions.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Không tìm thấy quyền",
      });
    }
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy tất cả quyền thành công",
      data: permissions,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy tất cả quyền thất bại",
      error: error,
    });
  }
};
