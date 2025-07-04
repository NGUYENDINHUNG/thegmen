import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/userModel.schema.js";
import Role from "../models/roleModel.schema.js";
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      statusCode: 401,
      message: "Vui lòng đăng nhập để truy cập",
    });
  }

  let token = authHeader.split(" ")[1];
  if (token.includes("#")) {
    token = token.split("#")[0];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        message: "Không tìm thấy người dùng",
        errorCode: "USER_NOT_FOUND",
      });
    }
    const userRole = await Role.findById(user.role).populate("permissions");
    const permissions = userRole?.permissions?.map((p) => p.name) || [];
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      phoneNumber: decoded.phoneNumber,
      address: decoded.address,
      avatar: decoded.avatar,
      role: userRole,
      permissions: permissions,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
        errorCode: "TOKEN_EXPIRED",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token không hợp lệ",
        errorCode: "INVALID_TOKEN",
      });
    }
    return res.status(402).json({
      message: "Không thể xác thực người dùng",
      errorCode: "AUTH_FAILED",
    });
  }
};

export { verifyToken };
