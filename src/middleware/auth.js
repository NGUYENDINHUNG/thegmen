
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
  }
};

export default verifyToken;
