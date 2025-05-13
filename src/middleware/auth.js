import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Bạn chưa truyền access token ở headers" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("Lỗi verify token:", error.message);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        message: "Token đã hết hạn, vui lòng đăng nhập lại",
        errorCode: "TOKEN_EXPIRED"
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        message: "Token không hợp lệ", 
        errorCode: "INVALID_TOKEN" 
      });
    }
    
    return res.status(401).json({ 
      message: "Không thể xác thực người dùng",
      errorCode: "AUTH_FAILED"
    });
  }
};

const apiKeyAuth = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey) {
    return res.status(401).json({ message: "API Key is missing" });
  }

  if (clientKey !== process.env.API_KEY) {
    return res.status(403).json({ message: "Invalid API Key" });
  }

  next(); 
};

export { verifyToken, apiKeyAuth };
