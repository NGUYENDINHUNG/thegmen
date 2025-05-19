import {
  CreateCollectionService,
  UpdateCollectionService,
  GetCollectionByIdService,
  GetAllCollectionService,
  SoftDeleteCollectionService,
  RestoreCollectionService,
  AddProductToCollectionService,
  RemoveProductFromCollectionService,
  GetProductsByCollectionIdService,
  GetCollectionsByProductIdService,
} from "./conllectionService.js";
import {
  postUploadMultipleFilesAPI,
  postUploadSingleFileApi,
} from "../FileUpload/fileController.js";

export const CreateCollection = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
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

    const data = await CreateCollectionService(
      name,
      slug,
      description,
      imageUrls
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Tạo bộ sưu tập thành công",
      data: data,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Tạo bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const UpdateCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const { name, slug, description } = req.body;

    const updateData = {
      name,
      slug,
      description,
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

    const updated = await UpdateCollectionService(collectionId, updateData);

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật bộ sưu tập thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Cập nhật bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetCollectionById = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const collection = await GetCollectionByIdService(collectionId);

    if (!collection) {
      return res.status(404).json({
        statusCode: 404,
        message: "Không tìm thấy bộ sưu tập",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy thông tin bộ sưu tập thành công",
      data: collection,
    });
  } catch (error) {
    console.error("Error getting collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy thông tin bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetAllCollection = async (req, res) => {
  try {
    const { pageSize, currentPage } = req.query;
    let collections = null;

    if (pageSize && currentPage) {
      collections = await GetAllCollectionService(
        pageSize,
        currentPage,
        req.query
      );
    } else {
      collections = await GetAllCollectionService();
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách bộ sưu tập thành công",
      data: collections,
    });
  } catch (error) {
    console.error("Error getting all collections:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy danh sách bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const SoftDeleteCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const deletedCollection = await SoftDeleteCollectionService(collectionId);

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa bộ sưu tập thành công",
      data: deletedCollection,
    });
  } catch (error) {
    console.error("Error soft deleting collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const RestoreCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const restoredCollection = await RestoreCollectionService(collectionId);

    return res.status(200).json({
      statusCode: 200,
      message: "Khôi phục bộ sưu tập thành công",
      data: restoredCollection,
    });
  } catch (error) {
    console.error("Error restoring collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Khôi phục bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const AddProductToCollection = async (req, res) => {
  try {
    const { collectionId, productId } = req.body;
    const result = await AddProductToCollectionService(collectionId, productId);

    return res.status(200).json({
      statusCode: 200,
      message: "Thêm sản phẩm vào bộ sưu tập thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error adding product to collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Thêm sản phẩm vào bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const RemoveProductFromCollection = async (req, res) => {
  try {
    const { collectionId, productId } = req.body;
    const result = await RemoveProductFromCollectionService(
      collectionId,
      productId
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa sản phẩm khỏi bộ sưu tập thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error removing product from collection:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Xóa sản phẩm khỏi bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetProductsByCollectionId = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { pageSize, currentPage } = req.query;

    const products = await GetProductsByCollectionIdService(
      collectionId,
      pageSize,
      currentPage
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách sản phẩm theo bộ sưu tập thành công",
      data: products,
    });
  } catch (error) {
    console.error("Error getting products by collection ID:", error);
    return res.status(400).json({
      statusCode: 400,
      message:
        error.message || "Lấy danh sách sản phẩm theo bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetCollectionsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const collections = await GetCollectionsByProductIdService(productId);
    console.log(collections);
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy danh sách bộ sưu tập theo sản phẩm thành công",
      data: collections,
    });
  } catch (error) {
    console.error("Error getting collections by product ID:", error);
    return res.status(400).json({
      statusCode: 400,
      message:
        error.message || "Lấy danh sách bộ sưu tập theo sản phẩm thất bại",
      error: error,
    });
  }
};
