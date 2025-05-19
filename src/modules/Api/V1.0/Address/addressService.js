import { AddressModel, UserModel } from "../../../../models/index.js";
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

    const newAddress = await AddressModel.create({
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

export const updateAddressService = async (addressId, userId, addressData) => {
  try {
    const address = await AddressModel.findById(addressId);

    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    if (address.userId.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền xóa địa chỉ này");
    }
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      { $set: addressData },
      { new: true }
    );
    const user = await UserModel.findOne({ "address.id": addressId });
    if (user) {
      await UserModel.findByIdAndUpdate(user._id, {
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
  queryString,
  userId
) => {
  try {
    let result = null;
    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      const { filter } = aqp(queryString);
      filter.user = userId;
      delete filter.pageSize;
      delete filter.currentPage;

      result = await AddressmModel.find(filter).skip(offset).limit(pageSize).exec();
    } else {
      result = await AddressModel.find({});
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllAddressService:", error);
    return null;
  }
};

export const getAllUserAddressService = async (userId) => {
  try {
    const user = await UserModel.findById(userId).populate("addresses");

    if (!user) {
      throw new Error("User not found");
    }

    return user.addresses;
  } catch (error) {
    console.error("Error in getUserAddressesService:", error);
    throw error;
  }
};

export const deleteAddressService = async (addressId, userId) => {
  try {
    const address = await AddressModel.findById(addressId);
    if (!address) {
      throw new Error("Địa chỉ không tồn tại");
    }
    if (address.userId.toString() !== userId.toString()) {
      throw new Error("Bạn không có quyền xóa địa chỉ này");
    }
    const deletedAddress = await AddressModel.findByIdAndDelete(addressId);

    await UserModel.updateOne(
      { addresses: addressId },
      { $pull: { addresses: addressId } }
    );
    if (deletedAddress.isDefault) {
      const user = await UserModel.findById(deletedAddress.userId).populate(
        "addresses"
      );
      if (user && user.addresses.length > 0) {
        const newDefault = user.addresses[0];
        await AddressModel.findByIdAndUpdate(newDefault._id, { isDefault: true });
        await UserModel.findByIdAndUpdate(user._id, {
          address: {
            id: newDefault._id,
            fullname: newDefault.fullname,
            phoneNumber: newDefault.phoneNumber,
            address: newDefault.address,
            provinceName: newDefault.provinceName,
            districtName: newDefault.districtName,
            wardName: newDefault.wardName,
            isDefault: true,
          },
        });
      } else {
        await UserModel.findByIdAndUpdate(deletedAddress.userId, { address: null });
      }
    }
    return deletedAddress;
  } catch (error) {
    console.error("lỗi khi xóa địa chỉ:", error);
    throw error;
  }
};
