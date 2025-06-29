import Address from "../models/addressModel.schema.js";
import User from "../models/userModel.schema.js";

export const createAddressService = async (userId, addressData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        EC: 404,
        EM: "Không tìm thấy người dùng",
      };
    }
    if (!addressData) {
      return {
        EC: 422,
        EM: "Dữ liệu địa chỉ không hợp lệ",
      };
    }
    if (!/^(0)(3|5|7|8|9)[0-9]{8}$/.test(addressData.phoneNumber)) {
      return {
        EC: 422,
        EM: "Số điện thoại không hợp lệ",
      };
    }
    if (!/^[A-Za-zÀ-ỹà-ỹ\s]+$/.test(addressData.fullname)) {
      return {
        EC: 422,
        EM: "Tên người nhận không chứa ký tự đặc biệt",
      };
    }
    const addressCount = await Address.countDocuments({ userId });

    if (addressCount === 0) {
      addressData.isDefault = true;
    }

    if (addressData.isDefault) {
      await Address.updateMany({ userId }, { $set: { isDefault: false } });
    }

    const newAddress = await Address.create({
      ...addressData,
      userId: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { addresses: newAddress._id },
    });

    return {
      EC: 0,
      EM: "Thêm địa chỉ thành công",
      DT: newAddress,
    };
  } catch (error) {
    console.error("Error in createAddressService:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
    };
  }
};

export const updateAddressService = async (userId, addressId, addressData) => {
  try {
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return {
        EC: 403,
        EM: "Bạn không có quyền sửa địa chỉ này",
      };
    }
    if (addressData.phoneNumber) {
      if (!/^(0)(3|5|7|8|9)[0-9]{8}$/.test(addressData.phoneNumber)) {
        return {
          EC: 403,
          EM: "Số điện thoại không hợp lệ",
        };
      }
    }
    const addressCount = await Address.countDocuments({ userId });

    const isDefaultValue =
      addressData?.isDefault === true || addressData?.isDefault === "true";

    // Trường hợp duy nhất & bỏ mặc định → không cho phép
    if (addressCount === 1 && address.isDefault && isDefaultValue === false) {
      return {
        EC: 403,
        EM: "Không thể bỏ mặc định vì đây là địa chỉ duy nhất của bạn",
        DT: null,
      };
    }

    // Nếu không phải trường hợp đặc biệt, tiến hành cập nhật
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { $set: addressData },
      { new: true }
    );

    // Nếu đặt làm mặc định, cập nhật các địa chỉ khác
    if (addressData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { $set: { isDefault: false } }
      );
    }

    return {
      EC: 0,
      EM: "Cập nhật địa chỉ thành công",
      DT: updatedAddress,
    };
  } catch (error) {
    console.error("Error updating address:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
      DT: null,
    };
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
      return {
        EC: 403,
        EM: "Bạn không có quyền xóa địa chỉ này.",
      };
    }

    if (address.isDefault) {
      return {
        EC: 403,
        EM: "Không thể xóa địa chỉ mặc định vì đó là địa chỉ mặc định của bạn",
      };
    }

    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress) {
      return {
        EC: 404,
        EM: "Địa chỉ không tồn tại hoặc đã bị xóa",
      };
    }

    // Xóa khỏi mảng addresses của user
    await User.updateOne({ _id: userId }, { $pull: { addresses: addressId } });

    return {
      EC: 200,
      EM: "Xóa địa chỉ thành công",
    };
  } catch (error) {
    console.error("Error in deleteAddressService:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
    };
  }
};
