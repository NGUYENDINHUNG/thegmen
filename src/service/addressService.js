import Address from "../model/addressModel.schema.js";
import User from "../model/userModel.schema.js";
import aqp from "api-query-params";

export const createAddressService = async (userId, addressData) => {
  try {
    const {
      fullname,
      phoneNumber,
      address,
      provinceName,
      districtName,
      wardName,
      isDefault,
    } = addressData;

    const newAddress = await Address.create({
      userId: userId,
      fullname,
      phoneNumber,
      address,
      provinceName,
      districtName,
      wardName,
      isDefault,
    });

    if (isDefault) {
      await Address.updateMany(
        { user: userId, _id: { $ne: newAddress._id } },
        { isDefault: false }
      );

      await User.findByIdAndUpdate(userId, {
        address: {
          id: newAddress._id,
          fullname,
          phoneNumber,
          address,
          provinceName,
          districtName,
          wardName,
          isDefault,
        },
        $push: { addresses: newAddress._id },
      });
    }
    return newAddress;
  } catch (error) {
    throw error;
  }
};

export const updateAddressService = async (addressId, addressData) => {
  console.log(addressId);
  try {
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: addressData },
      { new: true }
    );
    const user = await User.findOne({ "address.id": addressId });
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        address: {
          id: updatedAddress._id,
          fullname: updatedAddress.fullname,
          phoneNumber: updatedAddress.phoneNumber,
          address: updatedAddress.address,
          provinceName: updatedAddress.provinceName,
          districtName: updatedAddress.districtName,
          wardName: updatedAddress.wardName,
          isDefault: updatedAddress.isDefault,
        },
      });
    }

    return updatedAddress;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const getAllAddressService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    let result = null;
    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      const { filter } = aqp(queryString);
      filter.user = userId;
      delete filter.pageSize;
      delete filter.currentPage;

      result = await Address.find(filter).skip(offset).limit(pageSize).exec();
    } else {
      result = await Address.find({});
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllAddressService:", error);
    return null;
  }
};

export const getAllUserAddressService = async (userId) => {
  try {
    const user = await User.findById(userId).populate("addresses");

    if (!user) {
      throw new Error("User not found");
    }

    return user.addresses;
  } catch (error) {
    console.error("Error in getUserAddressesService:", error);
    throw error;
  }
};
export const deleteAddressService = async (addressId) => {
  try {
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    if (!deletedAddress) {
      console.log("Địa chỉ không tồn tại hoặc đã bị xóa");
    }
    return deletedAddress;
  } catch (error) {
    console.error("Error in deleteAddressService:", error);
  }
};
