import express from "express";
import {
  createAddress,
  updateAddress,
  getAllAddress,
  deleteAddress,
} from "#controllers/addressController.js";
import { verifyToken } from "#middleware/auth.js";
const Addressrouter = express.Router();

Addressrouter.use(verifyToken);
Addressrouter.post("/createAddress", createAddress);
Addressrouter.put("/:addressId", updateAddress);
Addressrouter.get("/", getAllAddress);
Addressrouter.delete("/:addressId", deleteAddress);
export default Addressrouter;
