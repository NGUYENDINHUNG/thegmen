import Product from "../models/productModel.schema.js";
import aqp from "api-query-params";
import slugify from "slugify";
import Variants from "../models/variantsModel.schema.js";
import mongoose from "mongoose";

export const CreateProductService = async (productData) => {
  try {
    const {
      name,
      description,
      avatar,
      images,
      price,
      discount,
      discountType,
      type,
      color,
      size,
      stock,
      categories,
      sizeSuggestCategories,
      featured,
      UNISEXTYPE,
    } = productData;

    if (!name || !price) {
      return {
        EC: 400,
        EM: "Tên và giá sản phẩm là bắt buộc",
      };
    }

    let finalPrice = price;
    if (discount) {
      if (discountType === "PERCENTAGE" && (discount < 0 || discount > 100)) {
        return {
          EC: 400,
          EM: "Giảm giá theo phần trăm phải từ 0 đến 100",
        };
      }
      if (discountType === "FIXED_AMOUNT" && discount > price) {
        return {
          EC: 400,
          EM: "Giảm giá cố định không được lớn hơn giá sản phẩm",
        };
      }

      if (discountType === "PERCENTAGE") {
        finalPrice = price - (price * discount) / 100;
      } else if (discountType === "FIXED_AMOUNT") {
        finalPrice = price - discount;
      }
    }

    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });

    const newProduct = await Product.create({
      name,
      description,
      avatar,
      images,
      price,
      discount,
      discountType,
      type,
      color,
      size,
      stock,
      categories,
      sizeSuggestCategories,
      featured,
      slug,
      UNISEXTYPE,
      finalPrice: Math.round(finalPrice),
    });

    return newProduct;
  } catch (error) {
    console.log("Error in CreateProductService:", error);
    return {
      EC: 500,
      EM: error.message || "Lỗi server, vui lòng thử lại sau",
    };
  }
};
export const UpdateProductsService = async (ProductId, updateData) => {
  try {
    const existingProduct = await Product.findById(ProductId);
    if (!existingProduct) {
      return {
        EC: 404,
        EM: "Không tìm thấy sản phẩm",
      };
    }

    if (updateData.price || updateData.discount || updateData.discountType) {
      const price = updateData.price || existingProduct.price;
      const discount = updateData.discount || existingProduct.discount;
      const discountType =
        updateData.discountType || existingProduct.discountType;

      let finalPrice = price;
      if (discount) {
        if (discountType === "PERCENTAGE") {
          finalPrice = price - (price * discount) / 100;
        } else if (discountType === "FIXED_AMOUNT") {
          finalPrice = price - discount;
        }
      }
      updateData.finalPrice = Math.round(finalPrice);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      ProductId,
      { $set: updateData },
      { new: true }
    );

    return {
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      data: updatedProduct,
    };
  } catch (error) {
    console.error("Error in UpdateProductsService:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
    };
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
      .populate("variants", "size stock sku color images")
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

    const hasColorVariants = product.variants.some((variant) => variant.color);

    if (hasColorVariants) {
      const groupedVariants = product.variants.reduce((acc, variant) => {
        const color = variant.color || "default";
        if (!acc[color]) {
          acc[color] = {
            color: color,
            sizes: [],
            images: variant.images || [],
          };
        }

        acc[color].sizes.push({
          size: variant.size,
          stock: variant.stock,
          sku: variant.sku,
        });

        return acc;
      }, {});

      const variantsArray = Object.values(groupedVariants);
      return {
        product: {
          ...product,
          variants: variantsArray,
        },
      };
    } else {
      const sizesArray = product.variants.map((variant) => ({
        size: variant.size,
        stock: variant.stock,
        sku: variant.sku,
      }));

      return {
        product: {
          ...product,
          variants: sizesArray,
        },
      };
    }
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm theo slug:", error);
    throw error;
  }
};
// export const GetAllProductsService = async (
//   pageSize,
//   currentPage,
//   queryString
// ) => {
//   try {
//     const { filter, sort } = aqp(queryString);
//     delete filter.current;
//     delete filter.pageSize;

//     const DEFAULT_PAGE_SIZE = 5;
//     const DEFAULT_CURRENT_PAGE = 1;

//     const limit = +pageSize || DEFAULT_PAGE_SIZE;
//     const page = +currentPage || DEFAULT_CURRENT_PAGE;
//     const offset = (page - 1) * limit;

//     const sortObj =
//       sort && typeof sort === "object" && Object.keys(sort).length > 0
//         ? sort
//         : { _id: -1 };

//     const result = await Product.find(filter)
//       .select("name price slug avatar images description categories isDeleted")
//       .populate("categories", "name slug")
//       .sort(sortObj)
//       .skip(offset)
//       .limit(limit)
//       .lean();

//     const totalItems = await Product.countDocuments(filter);
//     const totalPages = Math.ceil(totalItems / limit);

//     return {
//       meta: {
//         currentPage: page,
//         pageSize: limit,
//         totalItems,
//         totalPages,
//       },
//       result,
//     };
//   } catch (error) {
//     console.error("GetAllProductsService error:", error);
//     throw new Error(`Lỗi khi lấy danh sách sản phẩm: ${error.message}`);
//   }
// };

export const GetAllProductsService = async (
  pageSize,
  currentPage,
  queryString
) => {
  try {
    const { filter, sort } = aqp(queryString);
    delete filter.current;
    delete filter.pageSize;

    const DEFAULT_PAGE_SIZE = 5;
    const DEFAULT_CURRENT_PAGE = 1;

    const limit = +pageSize || DEFAULT_PAGE_SIZE;
    const page = +currentPage || DEFAULT_CURRENT_PAGE;
    const offset = (page - 1) * limit;

    const sortObj =
      sort && typeof sort === "object" && Object.keys(sort).length > 0
        ? sort
        : { _id: -1 };

    const result = await Product.find(filter)
      .select(
        "name price slug avatar images description categories isDeleted variants"
      )
      .populate("categories", "name slug")
      .populate({
        path: "variants",
        select: "size color stock sku",
        match: { isDeleted: false },
      })
      .sort(sortObj)
      .skip(offset)
      .limit(limit)
      .lean();

    const processedResult = result.map((product) => {
      const colors = [
        ...new Set(product.variants.map((index) => index.color)),
      ].filter(Boolean);
      const sizes = [
        ...new Set(product.variants.map((index) => index.size)),
      ].filter(Boolean);

      // Tạo object mới không bao gồm variants
      const { variants, ...productWithoutVariants } = product;

      return {
        ...productWithoutVariants,
        COLOR: colors,
        SIZE: sizes,
      };
    });

    const totalItems = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        currentPage: page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      result: processedResult,
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
