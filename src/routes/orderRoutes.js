import { Router } from "express";
import { byNowOrder, createOrder, getUserOrders, removeOrder } from "../Controller/orderController.js";
import { verifyToken } from "../middleware/auth.js";
const OrderRouter = Router();

OrderRouter.post("/createOrder", verifyToken, createOrder);
OrderRouter.post("/byNow", verifyToken, byNowOrder);
OrderRouter.get("/byNow", verifyToken, getUserOrders);
OrderRouter.delete("/:orderId", verifyToken, removeOrder);
export default OrderRouter;
