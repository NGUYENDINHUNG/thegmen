import apiError from "../constants/apiError.js";
import Role from "../models/roleModel.schema.js";

export const createRoleService = async (roleData) => {
  try {
    const role = await Role.create(roleData);
    return role;
  } catch (error) {
    throw new apiError(400, error);
  }
};

export const getRoleService = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new apiError(400, "Role not found");
    }
    return role;
  } catch (error) {
    throw new apiError(400, error);
  }
};

export const updateRoleService = async (roleId, roleData) => {
  try {
    const role = await Role.findByIdAndUpdate(roleId, roleData, { new: true });
    return role;
  } catch (error) {
    throw new apiError(400, error);
  }
};

export const deleteRoleService = async (roleId) => {
  try {
    const role = await Role.findByIdAndDelete(roleId);
    if (!role) {
      throw new apiError(400, "Role not found");
    }
    return role;
  } catch (error) {
    throw new apiError(400, error);
  }
};
``;
