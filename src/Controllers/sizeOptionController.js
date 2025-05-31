import {
  createSizeOption,
  updateSizeOption,
  deleteSizeOption,
  getSizeOptionById,
  getAllSizeOptions,
} from "../services/sizeOptionService.js";

export const createSizeOptionController = async (req, res) => {
  try {
    const sizeOption = await createSizeOption(req.body);
    res.status(201).json({
      success: true,
      message: "Size option created successfully",
      data: sizeOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating size option",
      error: error.message,
    });
  }
};

export const updateSizeOptionController = async (req, res) => {
  try {
    const sizeOption = await updateSizeOption(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Size option updated successfully",
      data: sizeOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating size option",
      error: error.message,
    });
  }
};

export const deleteSizeOptionController = async (req, res) => {
  try {
    const sizeOption = await deleteSizeOption(req.params.id);
    res.status(200).json({
      success: true,
      message: "Size option deleted successfully",
      data: sizeOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting size option",
      error: error.message,
    });
  }
};

export const getSizeOptionByIdController = async (req, res) => {
  try {
    const sizeOption = await getSizeOptionById(req.params.id);
    res.status(200).json({
      success: true,
      message: "Size option fetched successfully",
      data: sizeOption,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching size option",
      error: error.message,
    });
  }
};

export const getAllSizeOptionsController = async (req, res) => {
  try {
    const sizeOptions = await getAllSizeOptions();
    res.status(200).json({
      success: true,
      message: "Size options fetched successfully",
      data: sizeOptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching size options",
      error: error.message,
    });
  }
};
