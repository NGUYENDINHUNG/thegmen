import { Router } from "express";
import { byNowOrder, createOrder, getUserOrders, removeOrder } from "../Controllers/orderController.js";
import { verifyToken } from "../middleware/auth.js";
const OrderRouter = Router();

OrderRouter.post("/createOrder", verifyToken, createOrder);
OrderRouter.post("/byNow", verifyToken, byNowOrder);
OrderRouter.get("/userOrders", verifyToken, getUserOrders);
OrderRouter.delete("/:orderId", verifyToken, removeOrder);
export default OrderRouter;
