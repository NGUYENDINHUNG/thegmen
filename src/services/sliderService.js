import Sliders from "../models/sliderModule.schema.js";

export const CreateSlidersService = async (imageUrl, linkUrl, position) => {
  try {
    let result = await Sliders.create({
      imageUrl: imageUrl,
      linkUrl: linkUrl,
      position: position,
    });
    return result;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi tạo slider.");
  }
};

export const UpdateSlidersService = async (SidersId, updateData) => {
  try {
    const updatedSliders = await Sliders.findByIdAndUpdate(
      SidersId,
      { $set: updateData },
      { new: true }
    );
    return updatedSliders;
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Lỗi khi cập nhật danh mục.");
  }
};
export const DeleteSliderService = async (sliderId) => {
  try {
    const deletedSlider = await Sliders.findByIdAndUpdate(
      sliderId,
      { $set: { isActive: false }, deletedAt: new Date() },
      { new: true }
    );
    return deletedSlider;
  } catch (error) {
    console.log(error);
    throw new Error("Không thể xóa slider.");
  }
};

export const GetAllSlidersService = async () => {
  try {
    const sliders = await Sliders.find(
      { isActive: true },
      "imageUrl linkUrl position"
    );
    return sliders;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi lấy slider.");
  }
};
