import Category from "../model/categoryModel.schema.js";
import aqp from "api-query-params";

export const CreateCategoryService = async (name, slug) => {
  try {
    let result = await Category.create({
      name: name,
      slug: slug,
    });
    return result;
  } catch (error) {}
};
export const UpdateCategoryService = async (categoryId, updateData) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true }
    );
    return updatedCategory;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật danh mục.");
  }
};
export const GetCategoryByIdService = async (categoryId) => {
  try {
    if (!categoryId) {
      return null;
    }
    const results = await Category.findById(categoryId);
    return results;
  } catch (error) {
    console.error("Lỗi khi tìm category theo ID:", error);
    throw error;
  }
};
export const GetAllCategoryService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    let result = null;
    if (pageSize && currentPage) {
      console.log(currentPage )
      let offset = (currentPage - 1) * pageSize;
      const { filter } = aqp(queryString);
      delete filter.pageSize;
      delete filter.currentPage;

      result = await Category.find(filter).skip(offset).limit(pageSize).exec();
    } else {
      result = await Category.find({});
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllCategoryService:", error);
    return null;
  }
};
