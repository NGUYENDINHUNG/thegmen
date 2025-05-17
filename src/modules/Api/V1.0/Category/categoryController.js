import {
  CreateCategoryService,
  UpdateCategoryService,
  GetCategoryByIdService,
  GetAllCategoryService,
} from "../../../services/categoryService.js";
import aqp from "api-query-params";

export const CreateCategory = async (req, res) => {
  const { name, slug } = req.body;
  const data = await CreateCategoryService(name, slug);
  return res.status(200).json(data);
};
export const UpdateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, slug } = req.body;
    const updated = await UpdateCategoryService(categoryId, { name, slug });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const GetCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const results = await GetCategoryByIdService(categoryId);
    if (!results) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy category",
      });
    }
    return res.status(200).json({
      EC: 0,
      EM: "Lấy thông tin category thành công",
      user: {
        id: results._id,
        name: results.name,
        slug: results.slug,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
export const GetAllCategory = async (req, res) => {
  let pageSize = req.query.pageSize;
  let currentPage = req.query.currentPage;
  let result = null;

  try {
    if (pageSize && currentPage) {
      result = await GetAllCategoryService(pageSize, currentPage, req.query);
    } else {
      result = await GetAllCategoryService();
    }

    if (result) {
      return res.status(200).json({
        EC: 0,
        data: result,
      });
    } else {
      return res.status(500).json({
        EC: -1,
        data: null,
      });
    }
  } catch (error) {
    console.log("Error in GetAllCategory:", error);
    return res.status(500).json({
      EC: -1,
      data: null,
    });
  }
};
