import { uploadSingleFile } from "../service/fileService.js";
import {
  ProductsConllectionService,
  UpdateProductsService,
  GetProductsByIdService,
  GetAllProductsService,
  SoftDeleteProductService,
  RestoreProductService,
} from "../service/productsService.js";

export const CreateProduct = async (req, res) => {
  const { name, price, discount, description, supplierId, categoryId } =
    req.body;
  let imageUrl = " ";
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  } else {
    let results = await uploadSingleFile(req.files.images);
    imageUrl = results.path;
  }
  const data = await ProductsConllectionService(
    name,
    price,
    discount,
    imageUrl,
    description,
    supplierId,
    categoryId
  );
  console.log("data", data);
  return res.status(200).json({
    statusCode: 200,
    message: "Create product successfully",
    data: data,
  });
};
export const UpdateProduct = async (req, res) => {
  const { name, price, discount, description, supplierId, categoryId } =
    req.body;
  const { ProductId } = req.params;
  const updateData = await UpdateProductsService(ProductId, {
    name,
    price,
    discount,
    description,
    supplierId,
    categoryId,
  });
  return res.status(200).json({
    statusCode: 200,
    message: "Update product successfully",
    data: updateData,
  });
};
export const GetProductById = async (req, res) => {
  const { ProductId } = req.params;
  const product = await GetProductsByIdService(ProductId);
  return res.status(200).json({
    statusCode: 200,
    message: "Get product by id successfully",
    data: product,
  });
};
export const GetAllProducts = async (req, res) => {
  const { pageSize, currentPage, queryString } = req.query;
  const products = await GetAllProductsService(
    pageSize,
    currentPage,
    queryString
  );
  return res.status(200).json({
    statusCode: 200,
    message: "Get all products successfully",
    data: products,
  });
};

export const SoftDeleteProduct = async (req, res) => {
  try {
    const { ProductId } = req.params;
    const deletedProduct = await SoftDeleteProductService(ProductId);

    return res.status(200).json({
      statusCode: 200,
      message: "Xóa sản phẩm thành công",
      data: deletedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
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
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Khôi phục sản phẩm thất bại",
    });
  }
};
