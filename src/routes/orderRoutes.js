import { Router } from "express";
import { createOrder } from "../Controller/OrderController.js";
import verifyToken from "../middleware/auth.js";
const OrderRouter = Router();

OrderRouter.post("/createOrder", verifyToken, createOrder);

export default OrderRouter;
