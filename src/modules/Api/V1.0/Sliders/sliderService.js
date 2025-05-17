import Sliders from "../../../../models/sliderModule.schema.js";
import aqp from "api-query-params";

export const CreateSlidersService = async (imageUrl, linkUrl, position) => {
  try {
    let result = await Sliders.create({
      imageUrl: imageUrl,
      linkUrl: linkUrl,
      position: position,
    });
    return result;
  } catch (error) {}
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
