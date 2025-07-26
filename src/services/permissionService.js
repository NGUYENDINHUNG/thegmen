import Permission from "../models/permission.js";
import aqp from "api-query-params";
//import apiError from "../constants/apiError.js";
export const createPermissionService = async (permissionData) => {
  try {
    const exitPermission = await Permission.findOne({
      apiPath: permissionData.apiPath,
      method: permissionData.method,
    });
    if (exitPermission) {
      return exitPermission;
    }
    const permission = await Permission.create(permissionData);

    return permission;
  } catch (error) {
    return error;
  }
};

export const getPermissionService = async (permissionId) => {
  try {
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return permission;
    }
    return permission;
  } catch (error) {
    return error;
  }
};

export const updatePermissionService = async (permissionId, permissionData) => {
  try {
    if (!permissionId) {
   //   throw new apiError(400, "Permission ID is required");
    }
    const permission = await Permission.findByIdAndUpdate(
      permissionId,
      permissionData,
      { new: true }
    );
    return permission;
  } catch (error) {
    return error;
  }
};

export const deletePermissionService = async (permissionId) => {
  try {
    if (!permissionId) {
    //  throw new apiError(400, "Permission ID is required");
    }
    const permission = await Permission.findByIdAndDelete(permissionId);

    return permission;
  } catch (error) {
    return error;
  }
};
export const GetAllPermissionsService = async (pageSize, currentPage, qs) => {
  try {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let result = null;
    let totalItems = 0;
    let totalPages = 0;

    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      let defaultLimit = +pageSize ? +pageSize : 10;
      totalItems = (await Permission.find(filter)).length;
      totalPages = Math.ceil(totalItems / defaultLimit);
      result = await Permission.find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort)
        .populate(population)
        .exec();
    }

    return {
      meta: {
        currentPage: +currentPage,
        pageSize: +pageSize,
        totalItems,
        totalPages,
      },
      result,
    };
  } catch (error) {
    console.log(error);
  }
};
