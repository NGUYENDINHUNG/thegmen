import Product from "../models/productModel.schema.js";
import aqp from "api-query-params";
import slugify from "slugify";
import Variants from "../models/variantsModel.schema.js";
import GroupProduct from "../models/groupProduct.schema.js";

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
      .populate("variants", "-createdAt -updatedAt -isDeleted -deletedAt -__v")
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
    let result = null;
    let totalItems = 0;
    let totalPages = 0;

    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      let defaultLimit = +pageSize ? +pageSize : 10;
      totalItems = (await Product.find(filter)).length;
      totalPages = Math.ceil(totalItems / defaultLimit);

      result = await Product.find(
        filter,
        "-createdAt -updatedAt -isDeleted -deletedAt"
      )
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort)
        .populate(population)
        .exec();
    }

    return {
      meta: {
        // currentPage: +currentPage,
        // pageSize: +pageSize,
        // totalItems,
        // totalPages,
      },
      result,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const SoftDeleteProductService = async (ProductId) => {
  console.log(ProductId);
  try {
    if (!ProductId) {
      throw new Error("ID sản phẩm không hợp lệ");
    }
    const deletedProduct = await Product.findByIdAndUpdate(
      ProductId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    console.log(deletedProduct);
    if (!deletedProduct) {
      throw new Error();
    }

    await Variants.updateMany(
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
