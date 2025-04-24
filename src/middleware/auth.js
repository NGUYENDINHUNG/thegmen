import jwt from "jsonwebtoken";
import "dotenv/config";

const auth = (req, res, next) => {
  const white_lists = ["/", "/register", "/login"];
  if (white_lists.find((item) => "/v1/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req?.headers?.authorization?.split(" ")?.[1]) {
      console.log(req?.headers?.authorization?.split(" ")?.[1]);
      const token = req.headers.authorization.split(" ")[1];
      //verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createBy: "Hung",
        };
      } catch (error) {
        console.log("««««« error »»»»»", error);
        return res.status(401).json({
          message: "Token bị hết hạn hoặc không hợp lệ",
        });
      }

      console.log("««««« token »»»»»", token);
      next();
    } else {
      //return exception
      return res.status(401).json({
        message: "Ban chua truyen access token tai headers",
      });
    }
  }
};

export default auth;
