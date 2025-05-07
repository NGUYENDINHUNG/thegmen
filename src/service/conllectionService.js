import Conllection from "../model/collectionModel.schema.js";
import aqp from "api-query-params";

export const CreateConllectionService = async (name, slug, description) => {
  try {
    let result = await Conllection.create({
      name: name,
      slug: slug,
      description: description,
    });
    return result;
  } catch (error) {}
};
export const UpdateConllectionService = async (ConllectionId, updateData) => {
  console.log(ConllectionId);
  try {
    const updatedConllection = await Conllection.findByIdAndUpdate(
      ConllectionId,
      { $set: updateData },
      { new: true }
    );
    return updatedConllection;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật danh mục.");
  }
};
export const GetConllectionByIdService = async (ConllectionId) => {
  try {
    if (!ConllectionId) {
      return null;
    }
    const results = await Conllection.findById(ConllectionId);
    return results;
  } catch (error) {
    console.error("Lỗi khi tìm conllection theo ID:", error);
    throw error;
  }
};
export const GetAllConllectionService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    let result = null;
    if (pageSize && currentPage) {
      console.log(currentPage);
      let offset = (currentPage - 1) * pageSize;
      const { filter } = aqp(queryString);
      delete filter.pageSize;
      delete filter.currentPage;

      result = await Conllection.find(filter)
        .skip(offset)
        .limit(pageSize)
        .exec();
    } else {
      result = await Conllection.find({});
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllConllectionService:", error);
    return null;
  }
};
export const deleteConllectionService = async (ConllectionId) => {
  try {
    const deletedConllection = await Conllection.findByIdAndDelete(
      ConllectionId
    );

    if (!deletedConllection) {
      console.log("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }
    return deletedConllection;
  } catch (error) {
    console.error("Error in deleteAddressService:", error);
  }
};
