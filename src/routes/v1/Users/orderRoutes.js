import { Router } from "express";
import {
  byNowOrder,
  createOrder,
  getUserOrders,
  removeOrder,
} from "../../../Controllers/orderController.js";
import { verifyToken } from "../../../middleware/auth.js";

const OrderRouter = Router();

OrderRouter.use(verifyToken);

OrderRouter.post("/createOrder", createOrder);
OrderRouter.post("/byNow", byNowOrder);
OrderRouter.get("/userOrders", getUserOrders);
OrderRouter.delete("/:orderId", removeOrder);
export default OrderRouter;
