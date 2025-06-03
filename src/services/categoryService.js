import slugify from "slugify";
import Category from "../models/categoriesModel.schema.js";

export const CreateCategoryService = async (name, images) => {
  try {
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new Error("Danh mục với slug này đã tồn tại");
    }
    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });
    const result = await Category.create({
      name,
      slug: slug,
      images,
    });
    return result;
  } catch (error) {
    console.log("Error in CreateCategoryService:", error);
    throw new Error(error.message || "Lỗi khi tạo danh mục");
  }
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
    console.log("Error in UpdateCategoryService:", error);
    throw new Error(error.message || "Lỗi khi cập nhật danh mục.");
  }
};
export const GetOneCategoryService = async (slug) => {
  try {
    const category = await Category.findOne({ slug }).populate("products");
    return category;
  } catch (error) {
    console.log("Error in GetOneCategoryService:", error);
    throw new Error(error.message || "Lỗi khi lấy danh mục.");
  }
};

export const GetAllCategoriesService = async () => {
  try {
    const categories = await Category.find();
    return categories;
  } catch (error) {
    console.log("Error in GetAllCategoriesService:", error);
    throw new Error(error.message || "Lỗi khi lấy danh mục.");
  }
};
