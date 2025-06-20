import {
  createAddressService,
  updateAddressService,
  getAllAddressService,
  deleteAddressService,
} from "#services/addressService.js";

export const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressData = req.body;
    const newAddress = await createAddressService(userId, addressData);

    return res.status(200).json({
      statusCode: 200,
      message: "Tạo địa chỉ thành công",
      data: newAddress,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi khi tạo địa chỉ",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const addressData = req.body;
    const result = await updateAddressService(userId, addressId, addressData);

    if (result.EC !== 0) {
      return res.status(result.EC).json({
        statusCode: result.EC,
        message: result.EM,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: result.EM,
      data: result.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi server khi cập nhật địa chỉ.",
      error: error.message,
    });
  }
};

export const getAllAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const addresses = await getAllAddressService(userId);

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy tất cả địa chỉ thành công",
      data: addresses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi khi lấy tất cả địa chỉ",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.params;
    const deleted = await deleteAddressService(userId, addressId);
    if (deleted.EC !== 0) {
      return res.status(deleted.EC).json({
        statusCode: deleted.EC,
        message: deleted.EM,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa địa chỉ thành công.",
      data: deleted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi server khi xóa địa chỉ.",
      error: error.message,
    });
  }
};
