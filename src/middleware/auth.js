import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/userModel.schema.js";
import Role from "../models/roleModel.schema.js";
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Bạn chưa truyền access token ở headers" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== req.cookies["refresh_token"]) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc đã bị hủy, vui lòng đăng nhập lại.",
        errorCode: "INVALID_TOKEN",
      });
    }
    const userRole = await Role.findById(user.role).populate("permissions");
    const permissions = userRole?.permissions?.map((p) => p.name) || [];
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      role: userRole,
      permissions: permissions,
    };

    next();
  } catch (error) {
    console.error("Lỗi verify token:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
        errorCode: "TOKEN_EXPIRED",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token không hợp lệ",
        errorCode: "INVALID_TOKEN",
      });
    }
    return res.status(401).json({
      message: "Không thể xác thực người dùng",
      errorCode: "AUTH_FAILED",
    });
  }
};

export { verifyToken };
