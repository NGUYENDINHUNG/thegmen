import Product from "../models/productModel.schema.js";
import aqp from "api-query-params";
import slugify from "slugify";
import Variants from "../models/variantsModel.schema.js";
import GroupProduct from "../models/groupProduct.schema.js";
import mongoose from "mongoose";

export const CreateProductService = async (productData) => {
  try {
    const {
      name,
      description,
      content,
      color,
      avatar,
      images,
      price,
      discount,
      discountType,
      categories,
      sizeSuggestCategories,
    } = productData;

    if (discount) {
      if (discountType === "PERCENTAGE" && (discount < 0 || discount > 100)) {
        throw new Error("Giảm giá theo phần trăm phải từ 0 đến 100");
      }
      if (discountType === "FIXED_AMOUNT" && discount > price) {
        throw new Error("Giảm giá cố định không được lớn hơn giá sản phẩm");
      }
    }

    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

    const newProduct = await Product.create({
      name,
      description,
      content,
      color,
      avatar,
      images,
      price,
      discount,
      discountType,
      categories,
      sizeSuggestCategories,
      slug: slug,
    });

    return newProduct;
  } catch (error) {
    console.log("Error in CreateProductService:", error);
    throw error;
  }
};
export const UpdateProductsService = async (ProductId, updateData) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      ProductId,
      { $set: updateData },
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật sản phẩm.");
  }
};
export const GetProductsBySlugService = async (slug) => {
  try {
    if (!slug) {
      throw new Error("Slug không hợp lệ");
    }
    const product = await Product.findOne(
      { slug: slug },
      "-createdAt -updatedAt -isDeleted -deletedAt -__v"
    )
      .populate("variants", "size stock sku")
      .populate({
        path: "sizeSuggestCategories",
        select: "-createdAt -updatedAt -isDeleted -deletedAt -__v",
        populate: {
          path: "sizeOptions",
          select: "-createdAt -updatedAt -isDeleted -deletedAt -__v",
        },
      })
      .populate("categories", "name slug")
      .select("-isDeleted -deletedAt -__v")
      .lean();

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    const groupItem = await GroupProduct.findOne({
      productId: product._id,
    }).lean();

    let groupProducts = [];
    if (groupItem?.groupKey) {
      const relatedGroupProducts = await GroupProduct.find({
        groupKey: groupItem.groupKey,
      })
        .populate({
          path: "productId",
          select: "avatar name slug",
        })
        .lean();
      groupProducts = relatedGroupProducts.map((index) => ({
        _id: index._id,
        color: index.color,
        product: index.productId,
      }));
    }
    return {
      product: {
        ...product,
        groupProducts,
      },
    };
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm theo slug:", error);
    throw error;
  }
};
export const GetAllProductsService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    const { filter, sort, population } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const DEFAULT_PAGE_SIZE = 5;
    const DEFAULT_CURRENT_PAGE = 1;

    const limit = +pageSize || DEFAULT_PAGE_SIZE;
    const page = +currentPage || DEFAULT_CURRENT_PAGE;
    const offset = (page - 1) * limit;

    const totalItems = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    const result = await Product.find(
      filter,
      "-createdAt -updatedAt -isDeleted -deletedAt"
    )
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      result,
    };
  } catch (error) {
    console.error("GetAllProductsService error:", error);
    throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
  }
};
export const SoftDeleteProductService = async (ProductId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(ProductId)) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const product = await Product.findById(ProductId);
    if (product.isDeleted) {
      throw new Error("Sản phẩm đã bị xóa trước đó");
    }
    const deletedAt = new Date();

    const deletedProduct = await Product.findByIdAndUpdate(
      ProductId,
      {
        isDeleted: true,
        deletedAt,
      },
      { new: true }
    );

    if (!deletedProduct) {
      throw new Error("Không tìm thấy sản phẩm để xóa");
    }

    await Variants.updateMany(
      { productId: ProductId },
      { isDeleted: true, deletedAt }
    );

    return { message: "Xóa sản phẩm thành công" };
  } catch (error) {
    console.error("Lỗi khi soft delete sản phẩm:", error.message);
    throw new Error(error.message);
  }
};
export const RestoreProductService = async (ProductId) => {
  try {
    const restoredProduct = await Product.findByIdAndUpdate(
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
