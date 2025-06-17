import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  removeItemFromCart,
  updateCartItem,
  updateItemSelection,
} from "../../../controllers/cartController.js";
import { verifyToken } from "../../../middleware/auth.js";
const Cartrouter = Router();

Cartrouter.use(verifyToken);
Cartrouter.post("/add-to-cart", addToCart);
Cartrouter.get("/get-cart", getCartByUser);
Cartrouter.delete("/remove-item", removeItemFromCart);
Cartrouter.put("/update-cart", updateCartItem);
Cartrouter.put("/update-item-selection", updateItemSelection);

export default Cartrouter;
