import {
  CreateCollectionService,
  UpdateCollectionService,
  GetCollectionByIdService,
  SoftDeleteCollectionService,
  RestoreCollectionService,
  AddProductToCollectionService,
  RemoveProductFromCollectionService,
  GetAllCollectionsService,
  GetProductsByCollectionSlugService,
} from "../services/conllectionService.js";
import { uploadSingleFile } from "../services/fileService.js";

export const CreateCollection = async (req, res) => {
  try {
    const { title, subTitle, description } = req.body;
    let imageUrl = " ";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      let results = await uploadSingleFile(req.files.images);
      imageUrl = results.path;
    }

    const data = await CreateCollectionService(
      title,
      subTitle,
      description,
      imageUrl
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Tạo bộ sưu tập thành công",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Tạo bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const UpdateCollection = async (req, res) => {
  try {
    const slug = req.params.slug;
    const { title, subTitle, description, images } = req.body || {};
    let updateData = {
      title,
      subTitle,
      description,
      images,
    };

    let imageUrl = "";
    if (req.files && req.files.images) {
      const results = await uploadSingleFile(req.files.images);
      imageUrl = results.path;
    }

    const updated = await UpdateCollectionService(slug, updateData, imageUrl);

    return res.status(200).json({
      statusCode: 200,
      message: "Cập nhật bộ sưu tập thành công",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Cập nhật bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetCollectionById = async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(slug);
    const collection = await GetCollectionByIdService(slug);

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
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Lấy thông tin bộ sưu tập thất bại",
      error: error,
    });
  }
};

export const GetAllCollections = async (req, res) => {
  try {
    const collections = await GetAllCollectionsService();
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy tất cả bộ sưu tập thành công",
      data: collections,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lấy tất cả bộ sưu tập thất bại",
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

export const GetProductsByCollectionSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { pageSize, currentPage } = req.query;
    const products = await GetProductsByCollectionSlugService(
      slug,
      pageSize,
      currentPage
    );
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy sản phẩm theo bộ sưu tập thành công",
      data: products,
    });
  } catch (error) {
    return res.status(404).json({
      statusCode: 404,
      message: error.message || "Lấy sản phẩm theo bộ sưu tập thất bại",
      error: error,
    });
  }
};
