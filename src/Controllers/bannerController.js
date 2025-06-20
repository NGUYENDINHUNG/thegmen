import {
  CreateBannerService,
  DeleteBannerService,
  GetAllBannerService,
  UpdateBannerService,
} from "../services/bannerService.js";
import { uploadSingleFile } from "../services/fileService.js";

export const CreateBanner = async (req, res) => {
  try {
    const { linkUrl, position, title, description } = req.body;
    let imageUrl = "";
    if (req.files?.images) {
      try {
        const result = await uploadSingleFile(req.files.images);
        imageUrl = result.path;
      } catch (error) {
        console.log("Error uploading images:", error);
      }
    }

    const result = await CreateBannerService(
      imageUrl,
      linkUrl,
      position,
      title,
      description
    );
    return res.status(200).json({
      statusCode: 200,
      message: "Create banner successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Error creating banner",
      data: null,
    });
  }
};
export const UpdateBanner = async (req, res) => {
  try {
    const SidersId = req.params.id;
    const { imageUrl, linkUrl, position } = req.body;
    const updated = await UpdateBannerService(SidersId, {
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
export const DeleteBanner = async (req, res) => {
  try {
    const sliderId = req.params.id;
    const deleted = await DeleteBannerService(sliderId);
    if (!deleted) {
      return res.status(404).json({ message: "Banner không tồn tại." });
    }
    res.status(200).json({
      statusCode: 200,
      message: "Đã xóa banner (isActive: false)",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const GetAllBanner = async (req, res) => {
  try {
    const sliders = await GetAllBannerService();
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy tất cả banner thành công",
      data: sliders,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi lấy banner",
      error: error.message,
    });
  }
};
