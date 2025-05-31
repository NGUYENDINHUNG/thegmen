import SizeSuggestCategory from "../models/SizeSuggestCategorySchema.js";

export const createSizeSuggestCategory = async (data) => {
  try {
    const sizeSuggestCategory = await SizeSuggestCategory.create(data);
    return sizeSuggestCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSizeSuggestCategory = async (
  sizeSuggestCategoryId,
  sizeSuggestCategoryData
) => {
  try {
    const sizeSuggestCategory = await SizeSuggestCategory.findByIdAndUpdate(
      sizeSuggestCategoryId,
      sizeSuggestCategoryData,
      { new: true }
    );
    return sizeSuggestCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteSizeSuggestCategory = async (sizeSuggestCategoryId) => {
  try {
    const sizeSuggestCategory = await SizeSuggestCategory.findByIdAndDelete(
      sizeSuggestCategoryId
    );
    return sizeSuggestCategory;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSizeSuggestCategoryById = async (sizeSuggestCategoryId) => {
  try {
    const sizeSuggestCategory = await SizeSuggestCategory.findById(
      sizeSuggestCategoryId,
      "type sizeOptions images"
    ).populate("sizeOptions", "-createdAt -updatedAt");
    return sizeSuggestCategory;
  } catch (error) {
    throw new Error(error);
  }
};
