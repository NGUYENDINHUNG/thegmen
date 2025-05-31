import { uploadSingleFile } from "../services/fileService.js";
import {
  createSizeSuggestCategory,
  updateSizeSuggestCategory,
  deleteSizeSuggestCategory,
  getSizeSuggestCategoryById,
} from "../services/sizeSuggestCategoryservice.js";

export const createSizeSuggestCategoryController = async (req, res) => {
  try {
    const { type } = req.body;
    let { sizeOptions } = req.body;
    sizeOptions = JSON.parse(sizeOptions);

    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      let results = await uploadSingleFile(req.files.images);
      imageUrl = results.path;
    }
    const sizeSuggestCategory = await createSizeSuggestCategory({
      type,
      sizeOptions,
      images: imageUrl, 
    });
    res.status(200).json({
      success: true,
      message: "Size suggest category created successfully",
      data: sizeSuggestCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating size suggest category",
      error: error.message,
    });
  }
};

export const updateSizeSuggestCategoryController = async (req, res) => {
  try {
    const sizeSuggestCategory = await updateSizeSuggestCategory(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Size suggest category updated successfully",
      data: sizeSuggestCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating size suggest category",
      error: error.message,
    });
  }
};

export const deleteSizeSuggestCategoryController = async (req, res) => {
  try {
    const sizeSuggestCategory = await deleteSizeSuggestCategory(req.params.id);
    res.status(200).json({
      success: true,
      message: "Size suggest category deleted successfully",
      data: sizeSuggestCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting size suggest category",
      error: error.message,
    });
  }
};

export const getSizeSuggestCategoryByIdController = async (req, res) => {
  try {
    const sizeSuggestCategory = await getSizeSuggestCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Size suggest category fetched successfully",
      data: sizeSuggestCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching size suggest category",
      error: error.message,
    });
  }
};
