const [
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
] = [400, 401, 403, 404, 409, 500];

export const ApiError = {
  badRequest: {
    status: BAD_REQUEST,
    code: 400,
    message: "Bad Request",
  },

  fileTooLarge: {
    status: BAD_REQUEST,
    code: 4001,
    message: "Tệp quá lớn. Kích thước tối đa được phép là 15MB",
  },

  // 401
  invalidAuthToken: {
    status: UNAUTHORIZED,
    code: 4014,
    message: "Invalid Authorization",
  },

  // 403
  forbidden: {
    status: FORBIDDEN,
    code: 403,
    message: "Forbidden",
  },

  // 404
  notFound: {
    status: NOT_FOUND,
    code: 404,
    message: "Không tìm thấy",
  },

  // 409
  groupNameAlreadyExists: {
    status: CONFLICT,
    code: 4091,
    message: "Group name already exists",
  },

  groupAlreadyExists: {
    status: CONFLICT,
    code: 4095,
    message: "Group already exists",
  },


  serverError: {
    status: INTERNAL_SERVER_ERROR,
    code: 500,
    message: "Lỗi máy chủ",
  },

  INVALID_ID: "INVALID_ID",
  INVALID_ACCOUNT: "INVALID_ACCOUNT",
  INVALID_VERIFICATION: "INVALID_VERIFICATION",
  INVALID_TOKEN: "INVALID_TOKEN",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  BAD_REQUEST: "BAD_REQUEST",
  INACTIVATE_ACCOUNT: "INACTIVATE_ACCOUNT",

  getBadRequestError(message, code, body = {}) {
    return {
      status: BAD_REQUEST,
      code,
      message,
      body,
    };
  },

  getConflictError(message, code, body = {}) {
    return {
      status: CONFLICT,
      code,
      message,
      body,
    };
  },
};
