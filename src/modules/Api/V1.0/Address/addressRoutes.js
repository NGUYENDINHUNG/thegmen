import express from "express";
import {
  createAddress,
  updateAddress,
  getAllAddress,
  getUserAddresses,
  deleteAddress,
} from "./addressController.js";

const Addressrouter = express.Router();

Addressrouter.post("/createAddress", createAddress);
Addressrouter.put("/:addressId", updateAddress);
Addressrouter.get("/", getAllAddress);
Addressrouter.get("/my-addresses", getUserAddresses);
Addressrouter.delete("/:addressId", deleteAddress);
export default Addressrouter;
