import {
  ProductModel,
  SupplierModel,
  CategoryModel,
  VariantModel,
} from "../../../../models/index.js";
import aqp from "api-query-params";

export const ProductsConllectionService = async (
  name,
  price,
  images,
  description,
  supplierId,
  categoryId
) => {
  try {
    const [existSupplier, existCategory] = await Promise.all([
      SupplierModel.findOne({ _id: supplierId }),
      CategoryModel.findOne({ _id: categoryId }),
    ]);
    const errors = [];
    if (!existSupplier) errors.push("Nhà cung cấp không khả dụng");
    if (!existCategory) errors.push("Danh mục không khả dụng");

    if (errors.length > 0) {
      throw {
        status: 400,
        errors,
        message: "Không khả dụng",
      };
    }

    let result = await ProductModel.create({
      name: name,
      price: price,
      images: images,
      description: description,
      supplierId: supplierId,
      categoryId: categoryId,
    });
    return result;
  } catch (error) {
    console.log("Error in ProductsConllectionService:", error);
    throw error;
  }
};

export const UpdateProductsService = async (ProductId, updateData) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      ProductId,
      { $set: updateData },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật sản phẩm.");
  }
};

export const GetProductsByIdService = async (ProductId) => {
  try {
    if (!ProductId) {
      return null;
    }
    const results = await ProductModel.findById(ProductId).populate({
      path: "variants",
      match: { isDeleted: false },
    });
    return results;
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm theo ID:", error);
    throw error;
  }
};

export const GetAllProductsService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    let result = null;
    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      const { filter } = aqp(queryString);
      delete filter.pageSize;
      delete filter.currentPage;
      filter.isDeleted = false;
      result = await ProductModel.find(filter)
        .skip(offset)
        .limit(pageSize)
        .exec();
    } else {
      result = await ProductModel.find({});
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllProductsService:", error);
    return null;
  }
};

export const SoftDeleteProductService = async (ProductId) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndUpdate(
      ProductId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedProduct) {
      throw new Error("Sản phẩm không tồn tại hoặc đã bị xóa");
    }

    await VariantModel.updateMany(
      { productId: ProductId },
      { isDeleted: true, deletedAt: new Date() }
    );

    return deletedProduct;
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    throw error;
  }
};

export const RestoreProductService = async (ProductId) => {
  try {
    const restoredProduct = await ProductModel.findByIdAndUpdate(
      ProductId,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    if (!restoredProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }
    return restoredProduct;
  } catch (error) {
    console.error("Lỗi khi khôi phục sản phẩm:", error);
    throw error;
  }
};
