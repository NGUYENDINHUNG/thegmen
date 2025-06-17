import { Router } from "express";
import {
  buyNow,
  createOrder,
  getDetailOrder,
  getListOrder,
  removeOrder,
} from "../../../controllers/orderController.js";
import { verifyToken } from "../../../middleware/auth.js";

const OrderRouter = Router();

OrderRouter.use(verifyToken);

OrderRouter.post("/createOrder", createOrder);
OrderRouter.post("/buyNow", buyNow);
OrderRouter.delete("/:orderId", removeOrder);
OrderRouter.get("/listOrder", getListOrder);
OrderRouter.get("/detailOrder/:orderId", getDetailOrder);
export default OrderRouter;
