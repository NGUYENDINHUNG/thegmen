import { Router } from "express";
import {
  addToCart,
  getCartByUser,
  removeItemFromCart,
} from "./cartController.js";

const Cartrouter = Router();

Cartrouter.post("/add-to-cart", addToCart);
Cartrouter.get("/get-cart", getCartByUser);
Cartrouter.delete("/remove-item", removeItemFromCart);

export default Cartrouter;
