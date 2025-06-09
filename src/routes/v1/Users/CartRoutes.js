import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  removeItemFromCart,
  updateCartItem,
} from "../../../Controllers/cartController.js";
import { verifyToken } from "../../../middleware/auth.js";
const Cartrouter = Router();

Cartrouter.use(verifyToken);
Cartrouter.post("/add-to-cart", addToCart);
Cartrouter.get("/get-cart", getCartByUser);
Cartrouter.delete("/remove-item", removeItemFromCart);
Cartrouter.put("/update-cart", updateCartItem);

export default Cartrouter;
