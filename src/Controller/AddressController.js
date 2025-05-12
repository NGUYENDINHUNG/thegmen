import {
  createAddressService,
  updateAddressService,
  getAllAddressService,
  getAllUserAddressService,
  deleteAddressService,
} from "../services/addressService.js";
import aqp from "api-query-params";
export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressData = req.body;
    const newAddress = await createAddressService(userId, addressData);

    res.status(200).json({
      message: "Tạo địa chỉ thành công",
      data: newAddress,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Lỗi khi tạo địa chỉ",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const addressData = req.body;
    const updatedAddress = await updateAddressService(addressId, addressData);
    console.log(updatedAddress);
    return res.status(200).json({
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error("Error in updateAddressController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllAddress = async (req, res) => {
  let pageSize = req.query.pageSize;
  let currentPage = req.query.currentPage;
  let result = null;

  try {
    if (pageSize && currentPage) {
      result = await getAllAddressService(pageSize, currentPage, req.query);
    } else {
      result = await getAllAddressService();
    }

    if (result) {
      return res.status(200).json({
        EC: 0,
        data: result,
      });
    } else {
      return res.status(500).json({
        EC: -1,
        data: null,
      });
    }
  } catch (error) {
    console.log("Error in GetAllCategory:", error);
    return res.status(500).json({
      EC: -1,
      data: null,
    });
  }
};
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user._id;
    const addresses = await getAllUserAddressService(userId);
    console.log(addresses);
    return res.status(200).json({
      message: "Fetched user's addresses successfully",
      data: addresses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user's addresses",
      error: error.message,
    });
  }
};
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const deleted = await deleteAddressService(addressId);

    return res.status(200).json({
      message: "Xóa địa chỉ thành công.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server khi xóa địa chỉ.",
    });
  }
};
