import { Router } from "express";
import { createOrder, getUserOrders } from "../Controller/orderController.js";
import { verifyToken } from "../middleware/auth.js";
const OrderRouter = Router();

OrderRouter.post("/createOrder", verifyToken, createOrder);
OrderRouter.get("/userOrders", verifyToken, getUserOrders);
export default OrderRouter;
