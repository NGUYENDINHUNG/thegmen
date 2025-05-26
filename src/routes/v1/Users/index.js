import express from "express";
import Addressrouter from "./AddressRoutes.js";
import AuthRouter from "./AuthRoutes.js";
import Cartrouter from "./CartRoutes.js";
import OrderRouter from "./orderRoutes.js";
import userRouter from "./userRoutes.js";
import VoucherRouter from "./VoucherRoutes.js";

const UserRouter = express.Router();

UserRouter.post("/address", Addressrouter);
UserRouter.post("/auth", AuthRouter);
UserRouter.get("/cart", Cartrouter);
UserRouter.delete("/:orderId", userRouter);
UserRouter.post("/order", OrderRouter);
UserRouter.post("/vouchers", VoucherRouter);
export default UserRouter;
