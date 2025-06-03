import {
  uploadMultipleFiles,
  uploadSingleFile,
} from "../services/fileService.js";
import {
  CreateProductService,
  UpdateProductsService,
  GetProductsBySlugService,
  GetAllProductsService,
  SoftDeleteProductService,
  RestoreProductService,
} from "../services/productsService.js";

export const CreateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      discountType,
      description,
      categories,
      content,
      color,
      sizeSuggestCategories,
    } = req.body;

    let avatarUrl = "";
    let imageUrls = [];

    // 1. Upload ảnh bìa
    if (req.files?.avatar) {
      const result = await uploadSingleFile(req.files.avatar);
      avatarUrl = result.path;
    }
    console.log("avatarUrl", avatarUrl);
    // 2. Upload ảnh sản phẩm
    if (Array.isArray(req.files.images)) {
      const result = await uploadMultipleFiles(req.files.images);
      imageUrls = result.detail.map((item) => item.path);
    } else {
      const result = await uploadSingleFile(req.files.images);
      imageUrls = result.path;
    }
    const data = await CreateProductService({
      name,
      price,
      discount,
      discountType,
      description,
      categories,
      sizeSuggestCategories,
      content,
      color,
      avatar: avatarUrl,
      images: imageUrls,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Tạo sản phẩm thành công",
      data: data,
    });
  } catch (error) {
    console.error("CreateProduct error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Tạo sản phẩm thất bại",
    });
  }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { ProductId } = req.params;

    const updateData = await UpdateProductsService(ProductId, req.body);
    if (updateData.EC !== 0) {
      return res.status(200).json({
        statusCode: 200,
        message: updateData.EM,
        data: updateData.data,
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Cập nhật sản phẩm thành công",
        data: updateData,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Cập nhật sản phẩm thất bại",
    });
  }
};

export const GetOnProduct = async (req, res) => {
  const { slug } = req.params;
  try {
    const product = await GetProductsBySlugService(slug);
    return res.status(200).json({
      statusCode: 200,
      message: "Lấy sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lấy sản phẩm thất bại",
    });
  }
};

export const GetAllProducts = async (req, res) => {
  try {
    const { pageSize, currentPage } = req.query;

    const products = await GetAllProductsService(
      pageSize,
      currentPage,
      req.query
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Lấy tất cả sản phẩm thành công",
      data: products,
    });
  } catch (error) {
    console.error("GetAllProducts error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lấy tất cả sản phẩm thất bại",
    });
  }
};

export const SoftDeleteProduct = async (req, res) => {
  try {
    const { ProductId } = req.params;

    if (!ProductId) {
      return res.status(400).json({
        statusCode: 400,
        message: "ID sản phẩm không hợp lệ",
      });
    }

    const deletedProduct = await SoftDeleteProductService(ProductId);

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa sản phẩm thành công",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Controller error:", error.message);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Xóa sản phẩm thất bại",
    });
  }
};
export const RestoreProduct = async (req, res) => {
  try {
    const { ProductId } = req.params;
    const restoredProduct = await RestoreProductService(ProductId);

    return res.status(200).json({
      statusCode: 200,
      message: "Khôi phục sản phẩm thành công",
      data: restoredProduct,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Khôi phục sản phẩm thất bại",
    });
  }
};
