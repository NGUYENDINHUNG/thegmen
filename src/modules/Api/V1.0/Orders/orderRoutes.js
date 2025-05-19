import { Router } from "express";
import {
  byNowOrder,
  createOrder,
  getUserOrders,
  removeOrder,
} from "./orderController.js";

const OrderRouter = Router();

OrderRouter.post("/createOrder", createOrder);
OrderRouter.post("/byNow", byNowOrder);
OrderRouter.get("/byNow", getUserOrders);
OrderRouter.delete("/:orderId", removeOrder);
export default OrderRouter;
