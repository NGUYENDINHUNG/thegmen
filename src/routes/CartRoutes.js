import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  removeItemFromCart,
} from "../Controller/CartController.js";
import verifyToken from "../middleware/auth.js";

const Cartrouter = Router();

Cartrouter.post("/add-to-cart", verifyToken, addToCart);
Cartrouter.get("/get-cart", verifyToken, getCartByUser);
Cartrouter.delete("/remove-item", verifyToken, removeItemFromCart);

export default Cartrouter;
