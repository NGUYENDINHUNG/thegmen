import Banner from "../models/BannerModel.schema.js";

export const CreateBannerService = async (
  imageUrl,
  linkUrl,
  position,
  title,
  description
) => {
  try {
    let result = await Banner.create({
      imageUrl: imageUrl,
      linkUrl: linkUrl,
      position: position,
      title: title,
      description: description,
    });
    return result;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo banner.");
  }
};

export const UpdateBannerService = async (BannerId, updateData) => {
  try {
    const updatedSliders = await Banner.findByIdAndUpdate(
      BannerId,
      { $set: updateData },
      { new: true }
    );
    return updatedSliders;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Lỗi khi cập nhật banner.");
  }
};
export const DeleteBannerService = async (BannerId) => {
  try {
    const deletedSlider = await Banner.findByIdAndUpdate(
      BannerId,
      { $set: { isActive: false }, deletedAt: new Date() },
      { new: true }
    );
    return deletedSlider;
  } catch (error) {
    console.log(error);
    throw new Error("Không thể xóa banner.");
  }
};

export const GetAllBannerService = async () => {
  try {
    const sliders = await Banner.find(
      { isActive: true },
      "-__v -createdAt -updatedAt"
    );
    return sliders;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy banner.");
  }
};
