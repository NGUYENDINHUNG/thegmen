import jwt from "jsonwebtoken";
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
  FilterProductsService,
  GetRelatedProductsService,
} from "../services/productsService.js";

export const CreateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      discount,
      description_short,
      additional_info,
      description,
      categories,
      content,
      color,
      TYPE,
    } = req.body;

    let avatarUrl = "";
    let imageUrls = [];
    let sizeGuideUrl = "";

    if (req.files?.avatar) {
      try {
        const result = await uploadSingleFile(req.files.avatar);
        avatarUrl = result.path;
      } catch (error) {
        console.log("Error uploading avatar:", error);
      }
    }
    if (req.files?.sizeGuide) {
      try {
        const result = await uploadSingleFile(req.files.sizeGuide);
        sizeGuideUrl = result.path;
      } catch (error) {
        console.log("Error uploading sizeGuide:", error);
      }
    }

    if (req.files?.images) {
      try {
        if (Array.isArray(req.files.images)) {
          const result = await uploadMultipleFiles(req.files.images);
          imageUrls = result.detail.map((item) => item.path);
        } else {
          const result = await uploadSingleFile(req.files.images);
          imageUrls = [result.path];
        }
      } catch (error) {
        console.log("Error uploading images:", error);
      }
    }

    const data = await CreateProductService({
      name,
      price,
      discount,
      description_short,
      additional_info,
      description,
      categories,
      content,
      color,
      avatar: avatarUrl,
      images: imageUrls,
      sizeGuide: sizeGuideUrl,
      TYPE,
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
    const {
      name,
      price,
      discount,
      description_short,
      additional_info,
      description,
      categories,
      content,
      slug,
      color,
      TYPE,
    } = req.body || {};
    let avatarUrl = "";
    let imageUrls = [];
    let sizeGuideUrl = "";

    if (req.files?.avatar) {
      try {
        const result = await uploadSingleFile(req.files.avatar);
        avatarUrl = result.path;
      } catch (error) {
        console.log("Error uploading avatar:", error);
      }
    }
    if (req.files?.sizeGuide) {
      try {
        const result = await uploadSingleFile(req.files.sizeGuide);
        sizeGuideUrl = result.path;
      } catch (error) {
        console.log("Error uploading sizeGuide:", error);
      }
    }

    if (req.files?.images) {
      try {
        if (Array.isArray(req.files.images)) {
          const result = await uploadMultipleFiles(req.files.images);
          imageUrls = result.detail.map((item) => item.path);
        } else {
          const result = await uploadSingleFile(req.files.images);
          imageUrls = [result.path];
        }
      } catch (error) {
        console.log("Error uploading images:", error);
      }
    }

    const updateData = await UpdateProductsService(ProductId, {
      name,
      price,
      discount,
      description_short,
      additional_info,
      description,
      categories,
      content,
      color,
      slug,
      avatar: avatarUrl,
      images: imageUrls,
      sizeGuide: sizeGuideUrl,
      TYPE,
    });
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
  let userId = null;

  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded._id;
    } catch (error) {
      console.log("Error verifying token:", error);
    }
  }
  try {
    const product = await GetProductsBySlugService(slug, userId);
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

export const FilterProducts = async (req, res) => {
  try {
    const data = await FilterProductsService(req.query);

    if (data.EC !== 0) {
      return res.status(200).json({
        statusCode: 200,
        message: data.EM,
        data: data.data,
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Lọc sản phẩm thành công",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lọc sản phẩm thất bại",
    });
  }
};

export const GetRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit } = req.query;

    const result = await GetRelatedProductsService(slug, limit);
    if (result.EC !== 0) {
      return res.status(404).json({
        statusCode: 404,
        message: result.EM,
        data: null,
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: result.EM,
        data: result.data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Lỗi server, vui lòng thử lại sau",
      data: null,
    });
  }
};
