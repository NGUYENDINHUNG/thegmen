import express from "express";
import {
  createAddress,
  updateAddress,
  getAllAddress,
  getUserAddresses,
  deleteAddress,
} from "../Controllers/addressController.js";
import { verifyToken } from "../../../middleware/auth.js";

const Addressrouter = express.Router();

Addressrouter.post("/createAddress", verifyToken, createAddress);
Addressrouter.put("/:addressId", verifyToken, updateAddress);
Addressrouter.get("/", verifyToken, getAllAddress);
Addressrouter.get("/my-addresses", verifyToken, getUserAddresses);
Addressrouter.delete("/:addressId", verifyToken, deleteAddress);
export default Addressrouter;
