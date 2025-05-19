import { postUploadMultipleFilesAPI, postUploadSingleFileApi } from "../FileUpload/fileController.js";
import {
  createVariantService,
  updateVariantService,
  getVariantByIdService,
  getVariantsByProductIdService,
  getAllVariantsService,
  softDeleteVariantService,
  restoreVariantService,
} from "./variantsService.js";

export const createVariant = async (req, res) => {
  try {
    const { name, color, size, stock, sku, productId } = req.body;
    let imageUrls = [];

    if (req.files && Object.keys(req.files).length > 0) {
      if (Array.isArray(req.files.images)) {
        const results = await postUploadMultipleFilesAPI(req.files.images);
        imageUrls = results.detail
          .filter((item) => item.status === "success")
          .map((item) => item.path);
      } else {
        const result = await postUploadSingleFileApi(req.files.images);
        if (result.status === "success") {
          imageUrls.push(result.path);
        }
      }
    }
    const variant = await createVariantService(
      name,
      color,
      size,
      stock,
      sku,
      imageUrls,
      productId
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Tạo biến thể thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Error creating variant:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Tạo biến thể thất bại",
      error: error,
    });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { name, color, size, store, sku } = req.body;

    const updateData = {
      name,
      color,
      size,
      store,
      sku,
    };

    if (req.files && Object.keys(req.files).length > 0) {
      let imageUrls = [];

      if (Array.isArray(req.files.images)) {
        const results = await uploadMultipleFiles(req.files.images);
        imageUrls = results.detail
          .filter((item) => item.status === "success")
          .map((item) => item.path);
      } else {
        const result = await uploadSingleFile(req.files.images);
        if (result.status === "success") {
          imageUrls.push(result.path);
        }
      }
      updateData.images = imageUrls;
    }

    const updatedVariant = await updateVariantService(variantId, updateData);

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật biến thể thành công",
      data: updatedVariant,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Cập nhật biến thể thất bại",
      error: error,
    });
  }
};

export const getVariantById = async (req, res) => {
  try {
    const { variantId } = req.params;
    const variant = await getVariantByIdService(variantId);

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy thông tin biến thể thành công",
      data: variant,
    });
  } catch (error) {
    console.error("Error getting variant:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy thông tin biến thể thất bại",
      error: error,
    });
  }
};

export const getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await getVariantsByProductIdService(productId);

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách biến thể theo sản phẩm thành công",
      data: variants,
    });
  } catch (error) {
    console.error("Error getting variants by product ID:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy danh sách biến thể theo sản phẩm thất bại",
      error: error,
    });
  }
};

export const getAllVariants = async (req, res) => {
  try {
    const { pageSize, currentPage, queryString } = req.query;
    const variants = await getAllVariantsService(
      pageSize,
      currentPage,
      queryString
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách biến thể thành công",
      data: variants,
    });
  } catch (error) {
    console.error("Error getting all variants:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy danh sách biến thể thất bại",
      error: error,
    });
  }
};

export const softDeleteVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const deletedVariant = await softDeleteVariantService(variantId);

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa biến thể thành công",
      data: deletedVariant,
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa biến thể thất bại",
      error: error,
    });
  }
};

export const restoreVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const restoredVariant = await restoreVariantService(variantId);

    return res.status(200).json({
      statusCode: 200,
      message: "Khôi phục biến thể thành công",
      data: restoredVariant,
    });
  } catch (error) {
    console.error("Error restoring variant:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Khôi phục biến thể thất bại",
      error: error,
    });
  }
};
