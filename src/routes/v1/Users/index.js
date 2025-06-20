import express from "express";
import Addressrouter from "#routes/v1/Users/AddressRoutes.js";
import AuthRouter from "#routes/v1/Users/AuthRoutes.js";
import Cartrouter from "#routes/v1/Users/CartRoutes.js";
import OrderRouter from "#routes/v1/Users/orderRoutes.js";
import VoucherRouter from "#routes/v1/Users/VoucherRoutes.js";
import FavoritesRouter from "#routes/v1/Users/favoritesRoutes.js";

const UserRouter = express.Router();

UserRouter.use("/address", Addressrouter);
UserRouter.use("/auth", AuthRouter);
UserRouter.use("/cart", Cartrouter);
UserRouter.use("/order", OrderRouter);
UserRouter.use("/vouchers", VoucherRouter);
UserRouter.use("/favorites", FavoritesRouter);

export default UserRouter;
