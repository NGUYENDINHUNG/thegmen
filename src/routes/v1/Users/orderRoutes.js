import { Router } from "express";
import {
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
// OrderRouter.post("/byNow", byNowOrder);
OrderRouter.get("/userOrders", getUserOrders);
OrderRouter.delete("/:orderId", removeOrder);
OrderRouter.get("/listOrder", getListOrder);
OrderRouter.get("/detailOrder/:orderId", getDetailOrder);
export default OrderRouter;
