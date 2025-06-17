import { Router } from "express";
import {
  buyNow,
  // byNowOrder,
  createOrder,
  getDetailOrder,
  getListOrder,
  getUserOrders,
  removeOrder,
} from "../../../controllers/orderController.js";
import { verifyToken } from "../../../middleware/auth.js";

const OrderRouter = Router();

OrderRouter.use(verifyToken);

OrderRouter.post("/createOrder", createOrder);
OrderRouter.post("/buyNow", buyNow);
OrderRouter.get("/userOrders", getUserOrders);
OrderRouter.delete("/:orderId", removeOrder);
OrderRouter.get("/listOrder", getListOrder);
OrderRouter.get("/detailOrder/:orderId", getDetailOrder);
export default OrderRouter;
