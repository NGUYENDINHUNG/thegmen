import { Router } from "express";
import { updateOrder } from "#controllers/orderController.js";
import checkPermission from "#middleware/checkPermission.js";
const OrderRouter = Router();

OrderRouter.put(
  "/updateOrder/:orderId",
  checkPermission("Update_Order"),
  updateOrder
);

export default OrderRouter;
