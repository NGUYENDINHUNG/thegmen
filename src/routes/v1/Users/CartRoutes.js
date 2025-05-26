import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  removeItemFromCart,
} from "../../../Controllers/cartController.js";
import { verifyToken } from "../../../middleware/auth.js";
const Cartrouter = Router();

Cartrouter.use(verifyToken);
Cartrouter.post("/add-to-cart", addToCart);
Cartrouter.get("/get-cart", getCartByUser);
Cartrouter.delete("/remove-item", removeItemFromCart);

export default Cartrouter;
