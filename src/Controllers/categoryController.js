import {
  CreateCategoryService,
  UpdateCategoryService,
  GetOneCategoryService,
  GetAllCategoriesService,
} from "#services/categoryService.js";
import { uploadSingleFile } from "#services/fileService.js";

export const CreateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      let results = await uploadSingleFile(req.files.images);
      imageUrl = results.path;
    }

    const data = await CreateCategoryService(name, imageUrl);
    return res.status(200).json({
      statusCode: 200,
      message: "Tạo danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi tạo danh mục",
      error: error.message,
    });
  }
};
export const UpdateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const { name, slug } = req.body;
    const updated = await UpdateCategoryService(categoryId, { name, slug });
    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật danh mục thành công",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi cập nhật danh mục",
      error: error.message,
    });
  }
};
export const GetOneCategory = async (req, res) => {
  try {
    const slug = req.params.slug;

    const data = await GetOneCategoryService(slug);

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi lấy danh mục",
      error: error.message,
    });
  }
};
export const GetAllCategories = async (req, res) => {
  try {
    const data = await GetAllCategoriesService();
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh mục thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Lỗi lấy danh mục",
      error: error.message,
    });
  }
};
