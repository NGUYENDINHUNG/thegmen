import {
  CreateConllectionService,
  UpdateConllectionService,
  GetConllectionByIdService,
  GetAllConllectionService,
  deleteConllectionService,
} from "../service/conllectionService.js";

export const CreateConllection = async (req, res) => {
  const { name, description, slug } = req.body;
  const data = await CreateConllectionService(name, description, slug);
  return res.status(200).json({
    statusCode: 200,
    message: "Create conllection successfully",
    data: data,
  });
};
export const UpdateConllection = async (req, res) => {
  try {
    const ConllectionId = req.params.id;
    const { name, slug, description } = req.body;
    const updated = await UpdateConllectionService(ConllectionId, {
      name,
      slug,
      description,
    });
    console.log(updated);
    return res.status(200).json({
      statusCode: 200,
      message: "update conllection successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const GetConllectionById = async (req, res) => {
  try {
    const ConllectionId = req.params.id;
    const results = await GetConllectionByIdService(ConllectionId);
    if (!results) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy conllection",
      });
    }
    return res.status(200).json({
      EC: 0,
      EM: "Lấy thông tin category thành công",
      data: {
        id: results._id,
        name: results.name,
        description: results.description,
        slug: results.slug,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
export const GetAllConllection = async (req, res) => {
  let pageSize = req.query.pageSize;
  let currentPage = req.query.currentPage;
  let result = null;

  try {
    if (pageSize && currentPage) {
      result = await GetAllConllectionService(pageSize, currentPage, req.query);
    } else {
      result = await GetAllConllectionService();
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
export const deleteConllection = async (req, res) => {
  try {
    const { ConllectionId } = req.params;
    const deleted = await deleteConllectionService(ConllectionId);

    return res.status(200).json({
      message: "Xóa bộ sưu tập thành công.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi server khi xóa địa chỉ.",
    });
  }
};
