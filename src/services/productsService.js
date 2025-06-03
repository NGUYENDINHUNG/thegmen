// co' cai dau buoi

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
    const existingProduct = await Product.findById(ProductId);
    if (!existingProduct) {
      return {
        EC: 404,
        EM: "Không tìm thấy sản phẩm"
      };
    }
    if (!updateData || Object.keys(updateData).length === 0) {
      return {
        EC: 400,
        EM: "Dữ liệu cập nhật không hợp lệ"
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      ProductId,
      { $set: updateData },
      { new: true }
    );

    return {
      EC: 0,
      EM: "Cập nhật sản phẩm thành công",
      data: updatedProduct
    };

  } catch (error) {
    console.error("Error in UpdateProductsService:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau"
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
      .populate("variants", "size stock sku ")
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
// export const GetAllProductsService = async (
//   pageSize,
//   currentPage,
//   queryString
// ) => {
//   try {
//     const { filter, sort, population } = aqp(queryString);
//     delete filter.current;
//     delete filter.pageSize;

//     const DEFAULT_PAGE_SIZE = 5;
//     const DEFAULT_CURRENT_PAGE = 1;

//     const limit = +pageSize || DEFAULT_PAGE_SIZE;
//     const page = +currentPage || DEFAULT_CURRENT_PAGE;
//     const offset = (page - 1) * limit;

//     const totalItems = await Product.countDocuments(filter);
//     const totalPages = Math.ceil(totalItems / limit);

//     const result = await Product.find(
//       filter,
//       "-createdAt -updatedAt -isDeleted -deletedAt"
//     )
//       .skip(offset)
//       .limit(limit)
//       .sort(sort)
//       .populate(population)
//       .exec();

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


    const sortObj = (sort && typeof sort === 'object' && Object.keys(sort).length > 0) ? sort : { _id: -1 };


    // const aggregatePipeline = [
    //   { $match: filter },
    //   { $sort: sortObj },
    //   {
    //     $group: {
    //       _id: "$groupKey", 
    //       representative: { $first: "$$ROOT" },
    //       groupProducts: {
    //         $push: {
    //           color: "$color",
    //           productId: "$_id",
    //           avatar: { $ifNull: ["$avatar", { $arrayElemAt: ["$images", 0] }] }
    //         }
    //       }
    //     }
    //   },
    //   {
    //     $replaceRoot: {
    //       newRoot: {
    //         $mergeObjects: [
    //           "$representative",
    //           { groupProducts: "$groupProducts" }
    //         ]
    //       }
    //     }
    //   },
    //   { $skip: offset },
    //   { $limit: limit }
    // ];
    const aggregatePipeline = [
      { $match: filter },
      { $sort: sortObj },
      {
        $group: {
          _id: "$groupKey",
          representative: { $first: "$$ROOT" },
          groupProducts: {
            $push: {
              color: "$color",
              productId: "$_id",
              avatar: { $ifNull: ["$avatar", { $arrayElemAt: ["$images", 0] }] },
              slug: "$slug"
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$representative",
              { groupProducts: "$groupProducts" }
            ]
          }
        }
      },
      // Populate categories
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories"
        }
      },
      // Populate variants
      {
        $lookup: {
          from: "variants",
          let: { variantIds: "$variants" },
          pipeline: [
            { $match: { $expr: { $and: [
              { $in: ["$_id", "$$variantIds"] },
              { $eq: ["$isDeleted", false] }
            ] } } }
          ],
          as: "variants"
        }
      },
      // Populate sizeSuggestCategories
      {
        $lookup: {
          from: "sizesuggestcategories",
          localField: "sizeSuggestCategories",
          foreignField: "_id",
          as: "sizeSuggestCategories"
        }
      },
      // Unwind sizeSuggestCategories to populate sizeOptions
      { $unwind: { path: "$sizeSuggestCategories", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "sizeoption",
          localField: "sizeSuggestCategories.sizeOptions",
          foreignField: "_id",
          as: "sizeSuggestCategories.sizeOptions"
        }
      },
      // Group back sizeSuggestCategories
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" },
          sizeSuggestCategories: { $push: "$sizeSuggestCategories" }
        }
      },
      {
        $addFields: {
          "doc.sizeSuggestCategories": "$sizeSuggestCategories"
        }
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $skip: offset },
      { $limit: limit }
    ];
    const result = await Product.aggregate(aggregatePipeline);

    // Đếm tổng số group (loại sản phẩm)
    const totalItemsAgg = await Product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$groupKey"
        }
      },
      { $count: "total" }
    ]);
    const totalItems = totalItemsAgg[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

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
