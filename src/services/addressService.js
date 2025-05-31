import Address from "../models/addressModel.schema.js";
import User from "../models/userModel.schema.js";

export const createAddressService = async (userId, addressData) => {
  try {
    if (addressData.isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }
    const newAddress = await Address.create({ ...addressData, userId: userId });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { addresses: newAddress._id },
    });

    return newAddress;
  } catch (error) {
    console.error("Error in createAddressService:", error);
    throw error;
  }
};

export const updateAddressService = async (userId, addressId, addressData) => {
  try {
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error("Bạn không có quyền sửa địa chỉ này.");
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: addressData },
      { new: true }
    );

    if (addressData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }
    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const getAllAddressService = async (userId) => {
  try {
    const addresses = await Address.find({ userId }, "-createdAt -updatedAt");
    return addresses;
  } catch (error) {
    console.log("Error in GetAllAddressService:", error);
    throw error;
  }
};

export const deleteAddressService = async (userId, addressId) => {
  try {
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      throw new Error("Bạn không có quyền xóa địa chỉ này.");
    }
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      throw new Error("Địa chỉ không tồn tại hoặc đã bị xóa");
    }
    await User.updateOne({ _id: userId }, { $pull: { addresses: addressId } });

    return deletedAddress;
  } catch (error) {
    console.error("Error in deleteAddressService:", error);
    throw error;
  }
};
