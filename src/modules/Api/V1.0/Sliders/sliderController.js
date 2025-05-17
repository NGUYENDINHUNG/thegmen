import {
  CreateSlidersService,
  DeleteSliderService,
  UpdateSlidersService,
} from "../../../services/sliderService.js";

export const CreateSliders = async (req, res) => {
  try {
    const { imageUrl, linkUrl, position } = req.body;
    const result = await CreateSlidersService(imageUrl, linkUrl, position);
    return res.status(200).json({
      statusCode: 200,
      message: "Create slider successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Error creating slider",
      data: null,
    });
  }
};
export const UpdateSliders = async (req, res) => {
  try {
    const SidersId = req.params.id;
    const { imageUrl, linkUrl, position } = req.body;
    const updated = await UpdateSlidersService(SidersId, {
      imageUrl,
      linkUrl,
      position,
    });
    res.status(200).json({
      statusCode: 200,
      messages: "update success",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const DeleteSlider = async (req, res) => {
  try {
    const sliderId = req.params.id;
    const deleted = await DeleteSliderService(sliderId);
    if (!deleted) {
      return res.status(404).json({ message: "Slider không tồn tại." });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Đã xóa slider (isActive: false)",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
