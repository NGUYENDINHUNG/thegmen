import express from "express";
import Addressrouter from "./AddressRoutes.js";
import AuthRouter from "./AuthRoutes.js";
import Cartrouter from "./CartRoutes.js";
import OrderRouter from "./orderRoutes.js";
import VoucherRouter from "./VoucherRoutes.js";
import FavoritesRouter from "./favoritesRoutes.js";

const UserRouter = express.Router();

UserRouter.use("/address", Addressrouter);
UserRouter.use("/auth", AuthRouter);
UserRouter.use("/cart", Cartrouter);
UserRouter.use("/order", OrderRouter);
UserRouter.use("/vouchers", VoucherRouter);
UserRouter.use("/favorites", FavoritesRouter);

export default UserRouter;
