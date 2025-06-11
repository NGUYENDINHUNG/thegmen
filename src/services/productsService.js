import Product from "../models/productModel.schema.js";
import aqp from "api-query-params";
import Variants from "../models/variantsModel.schema.js";
import mongoose from "mongoose";
import Favorites from "../models/favoritesModel.schema.js";
import Category from "../models/categoriesModel.schema.js";

export const CreateProductService = async (productData) => {
  try {
    const {
      name,
      description_short,
      description,
      additional_info,
      avatar,
      images,
      sizeGuide,
      price,
      discount,
      TYPE,
      color,
      size,
      stock,
      categories,
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
      finalPrice = price - (price * discount) / 100;
    }
    const newProduct = await Product.create({
      name,
      description,
      description_short,
      additional_info,
      avatar,
      images,
      price,
      discount,
      TYPE,
      color,
      size,
      stock,
      categories,
      sizeGuide,
      featured,
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

      let finalPrice = price;
      if (discount) {
        finalPrice = price - (price * discount) / 100;
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

export const GetProductsBySlugService = async (slug, userId) => {
  try {
    if (!slug) {
      throw new Error("Slug không hợp lệ");
    }
    const product = await Product.findOne(
      { slug: slug },
      "-createdAt -updatedAt -isDeleted -deletedAt -__v"
    )
      .populate("variants", "size stock sku color images")
      .populate("categories", "name slug")
      .select("-isDeleted -deletedAt -__v")
      .lean();

    if (!product) {
      throw new Error("Không tìm thấy sản phẩm");
    }

    let isFavorite = false;
    if (userId) {
      const favorite = await Favorites.findOne({
        userId,
        productId: product._id,
      });
      isFavorite = Boolean(favorite);
    }
    console.log(isFavorite);
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
          id: variant._id,
        });

        return acc;
      }, {});

      const variantsArray = Object.values(groupedVariants);
      return {
        product: {
          ...product,
          variants: variantsArray,
          isFavorite: isFavorite,
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
          isFavorite: isFavorite,
        },
      };
    }
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
    const { filter } = aqp(queryString);
    delete filter.currentPage;
    delete filter.pageSize;

    const DEFAULT_PAGE_SIZE = 5;
    const DEFAULT_CURRENT_PAGE = 1;

    const limit = +pageSize || DEFAULT_PAGE_SIZE;
    const page = +currentPage || DEFAULT_CURRENT_PAGE;
    const offset = (page - 1) * limit;

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

      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        avatar: product.avatar,
        images: product.images,
        description: product.description,
        categories: product.categories,
        isDeleted: product.isDeleted,
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

export const FilterProductsService = async (queryParams) => {
  try {
    const {
      minPrice,
      maxPrice,
      category,
      type,
      page = 1,
      limit = 10,
    } = queryParams;

    const filter = { isDeleted: false };

    if (type) {
      const validTypes = ["MEN", "WOMEN", "KIDS", "UNISEX"];
      if (!validTypes.includes(type)) {
        return { EC: 400, EM: "Type không hợp lệ", data: null };
      }
      filter.TYPE = type;
    }

    if (minPrice || maxPrice) {
      filter.$or = [
        {
          $and: [
            { finalPrice: { $exists: true, $ne: null } },
            ...(minPrice ? [{ finalPrice: { $gte: Number(minPrice) } }] : []),
            ...(maxPrice ? [{ finalPrice: { $lte: Number(maxPrice) } }] : []),
          ],
        },
        {
          $and: [
            { $or: [{ finalPrice: { $exists: false } }, { finalPrice: null }] },
            ...(minPrice ? [{ price: { $gte: Number(minPrice) } }] : []),
            ...(maxPrice ? [{ price: { $lte: Number(maxPrice) } }] : []),
          ],
        },
      ];
    }

    if (category) {
      const catDoc = await Category.findOne({
        $or: [{ name: category }, { slug: category }],
      }).select("_id");
      if (!catDoc) {
        return {
          EC: 11,
          EM: "Không có sản phẩm phù hợp với điều kiện tìm kiếm",
          data: {
            result: [],
          },
        };
      }
      filter.categories = catDoc._id;
    }

    // 5. Phân trang
    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    // 6. Query
    const products = await Product.find(filter)
      .select(
        "_id name description slug avatar images price finalPrice discount TYPE categories"
      )
      .populate("categories", "name slug")
      .skip(skip)
      .limit(limitNum)
      .lean();

    if (!products || products.length === 0) {
      return {
        EC: 11,
        EM: "Không có sản phẩm phù hợp với điều kiện tìm kiếm",
        data: {
          meta: {
            currentPage: pageNum,
            pageSize: limitNum,
            totalItems: 0,
            totalPages: 0,
          },
          result: [],
        },
      };
    }

    return {
      EC: 0,
      EM: "Lọc sản phẩm thành công",
      data: {
        meta: {
          currentPage: pageNum,
          pageSize: limitNum,
          totalItems: products.length,
          totalPages: Math.ceil(products.length / limitNum),
        },
        result: products,
      },
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Lỗi khi lọc sản phẩm",
      debugMessage: error.message,
    };
  }
};

export const GetRelatedProductsService = async (slug, limit = 4) => {
  try {
    const currentProduct = await Product.findOne({ slug: slug })
      .select("categories TYPE")
      .populate("categories", "_id");

    if (!currentProduct) {
      return {
        EC: 404,
        EM: "Không tìm thấy sản phẩm",
        data: null,
      };
    }

    const categoryIds = currentProduct.categories.map(
      (category) => category._id
    );
    const relatedProducts = await Product.find({
      _id: { $ne: currentProduct._id },
      isDeleted: false,
      categories: { $in: categoryIds },
      TYPE: currentProduct.TYPE,
    })
      .select(
        "name price finalPrice discount avatar images slug TYPE categories variants"
      )
      .populate("categories", "name slug")
      .populate("variants", "color size")
      .limit(limit)
      .lean();

    const processedResult = relatedProducts.map((product) => {
      const colors = [...new Set(product.variants.map((v) => v.color))].filter(
        Boolean
      );

      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        finalPrice: product.finalPrice,
        discount: product.discount,
        avatar: product.avatar,
        images: product.images,
        slug: product.slug,
        TYPE: product.TYPE,
        categories: product.categories,
        COLOR: colors,
      };
    });

    if (processedResult.length === 0) {
      return {
        EC: 404,
        EM: "Không tìm thấy sản phẩm liên quan",
        data: null,
      };
    } else {
    return {
      EC: 0,
      EM: "Lấy sản phẩm liên quan thành công",
      data: processedResult,
    };
  }
    } catch (error) {
    console.error("GetRelatedProductsService error:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
      data: null,
    };
  }
};



// export const GetProductsByTypeService = async (type, page = 1, limit = 10) => {
//   try {
//     const validTypes = ["MEN", "WOMEN", "KIDS", "UNISEX"];
//     if (!validTypes.includes(type)) {
//       return {
//         EC: 400,
//         EM: "Loại sản phẩm không hợp lệ",
//         data: null,
//       };
//     }

//     const skip = (page - 1) * limit;

//     const [products, total] = await Promise.all([
//       Product.find({
//         TYPE: type,
//         isDeleted: false,
//       })
//         .select(
//           "name price finalPrice discount avatar images slug TYPE categories"
//         )
//         .populate("categories", "name slug")
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Product.countDocuments({
//         TYPE: type,
//         isDeleted: false,
//       }),
//     ]);

//     const processedResult = products.map((product) => {
//       const { variants, ...productWithoutVariants } = product;
//       return {
//         ...productWithoutVariants,
//         COLOR: product.variants?.map((v) => v.color).filter(Boolean) || [],
//         SIZE: product.variants?.map((v) => v.size).filter(Boolean) || [],
//       };
//     });

//     return {
//       EC: 0,
//       EM: "Lấy sản phẩm theo loại thành công",
//       data: {
//         meta: {
//           currentPage: page,
//           pageSize: limit,
//           totalItems: total,
//           totalPages: Math.ceil(total / limit),
//         },
//         result: processedResult,
//       },
//     };
//   } catch (error) {
//     console.error("GetProductsByTypeService error:", error);
//     return {
//       EC: 500,
//       EM: "Lỗi server, vui lòng thử lại sau",
//       data: null,
//     };
//   }
// };

// export const GetProductsByCategoryService = async (
//   categoryId,
//   page = 1,
//   limit = 10
// ) => {
//   try {
//     const skip = (page - 1) * limit;

//     const [products, total] = await Promise.all([
//       Product.find({
//         categories: categoryId,
//         isDeleted: false,
//       })
//         .select(
//           "name price finalPrice discount avatar images slug TYPE categories"
//         )
//         .populate("categories", "name slug")
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//       Product.countDocuments({
//         categories: categoryId,
//         isDeleted: false,
//       }),
//     ]);

//     const processedResult = products.map((product) => {
//       const { variants, ...productWithoutVariants } = product;
//       return {
//         ...productWithoutVariants,
//         COLOR: product.variants?.map((v) => v.color).filter(Boolean) || [],
//         SIZE: product.variants?.map((v) => v.size).filter(Boolean) || [],
//       };
//     });

//     return {
//       EC: 0,
//       EM: "Lấy sản phẩm theo danh mục thành công",
//       data: {
//         meta: {
//           currentPage: page,
//           pageSize: limit,
//           totalItems: total,
//           totalPages: Math.ceil(total / limit),
//         },
//         result: processedResult,
//       },
//     };
//   } catch (error) {
//     console.error("GetProductsByCategoryService error:", error);
//     return {
//       EC: 500,
//       EM: "Lỗi server, vui lòng thử lại sau",
//       data: null,
//     };
//   }
// };

// export const GetTopSellingProductsService = async (limit = 10) => {
//   try {
//     // Giả sử bạn có một collection OrderItems để theo dõi số lượng sản phẩm đã bán
//     const topSellingProducts = await OrderItem.aggregate([
//       {
//         $match: {
//           isDeleted: false,
//         },
//       },
//       {
//         $group: {
//           _id: "$productId",
//           totalSold: { $sum: "$quantity" },
//         },
//       },
//       {
//         $sort: { totalSold: -1 },
//       },
//       {
//         $limit: limit,
//       },
//       {
//         $lookup: {
//           from: "products",
//           localField: "_id",
//           foreignField: "_id",
//           as: "product",
//         },
//       },
//       {
//         $unwind: "$product",
//       },
//       {
//         $replaceRoot: { newRoot: "$product" },
//       },
//     ]);

//     const processedResult = topSellingProducts.map((product) => {
//       const { variants, ...productWithoutVariants } = product;
//       return {
//         ...productWithoutVariants,
//         COLOR: product.variants?.map((v) => v.color).filter(Boolean) || [],
//         SIZE: product.variants?.map((v) => v.size).filter(Boolean) || [],
//       };
//     });

//     return {
//       EC: 0,
//       EM: "Lấy sản phẩm bán chạy thành công",
//       data: processedResult,
//     };
//   } catch (error) {
//     console.error("GetTopSellingProductsService error:", error);
//     return {
//       EC: 500,
//       EM: "Lỗi server, vui lòng thử lại sau",
//       data: null,
//     };
//   }
// };
