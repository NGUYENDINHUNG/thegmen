import Product from "#models/productModel.schema.js";
import aqp from "api-query-params";
import Variants from "#models/variantsModel.schema.js";
import mongoose from "mongoose";
import Favorites from "#models/favoritesModel.schema.js";
import Category from "#models/categoriesModel.schema.js";
import Order from "#models/orderModel.Schema.js";

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
      type,
      color,
      size,
      stock,
      categories,
      featured,
    } = productData;

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/[đĐ]/g, "d") // Chuyển đ/Đ thành d
      .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt
      .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu -
      .replace(/-+/g, "-") // Xóa dấu - liên tiếp
      .replace(/^-+|-+$/g, ""); // Xóa dấu - ở đầu và cuối

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
      type,
      color,
      size,
      stock,
      categories,
      slug,
      sizeGuide,
      featured,
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

    if (updateData.price !== undefined || updateData.discount !== undefined) {
      const price = updateData.price ?? existingProduct.price;
      const discount = updateData.discount ?? existingProduct.discount;

      let finalPrice = price;
      if (discount) {
        finalPrice = price - (price * discount) / 100;
      }
      updateData.finalPrice = Math.round(finalPrice);
    }

    // Sử dụng $set để chỉ cập nhật các trường được chỉ định
    const updatedProduct = await Product.findByIdAndUpdate(
      ProductId,
      { $set: updateData },
      { new: true }
    );

    return updatedProduct;
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
  queryString,
  userId
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
        "name price discount finalPrice slug avatar categories isDeleted variants "
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
    let favoriteProductIds = [];
    if (userId) {
      const favorites = await Favorites.find({ userId })
        .select("productId")
        .lean();
      favoriteProductIds = favorites.map((f) => f.productId.toString());
    }
    const processedResult = result.map((product) => {
      const colors = [
        ...new Set(product.variants.map((index) => index.color)),
      ].filter(Boolean);
      const sizes = [
        ...new Set(product.variants.map((index) => index.size)),
      ].filter(Boolean);
      const isFavorite = favoriteProductIds.includes(product._id.toString());
      return {
        _id: product._id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice: product.finalPrice,
        slug: product.slug,
        avatar: product.avatar,
        isFavorite: isFavorite,
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
export const FilterProductsService = async (queryParams, userId) => {
  try {
    const { minPrice, maxPrice, category, type, currentPage, pageSize } =
      queryParams;

    const filter = { isDeleted: false };

    if (type && type !== "all") {
      // Thêm điều kiện kiểm tra type !== "ALL"
      const validTypes = ["MEN", "WOMEN", "KIDS", "UNISEX"];
      if (!validTypes.includes(type)) {
        return { EC: 400, EM: "Type không hợp lệ", data: null };
      }
      filter.type = type;
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
            meta: {
              currentPage: currentPage ? Number(currentPage) : undefined,
              pageSize: pageSize ? Number(pageSize) : undefined,
              totalItems: 0,
              totalPages: 0,
            },
            result: [],
          },
        };
      }
      filter.categories = catDoc._id;
    }

    // Phân trang nếu có truyền page và limit
    const pageNum = currentPage ? Math.max(Number(currentPage), 1) : undefined;
    const limitNum = pageSize ? Math.max(Number(pageSize), 1) : undefined;
    const skip = pageNum && limitNum ? (pageNum - 1) * limitNum : undefined;

    // Đếm tổng số sản phẩm phù hợp filter
    const totalItems = await Product.countDocuments(filter);
    const totalPages = limitNum ? Math.ceil(totalItems / limitNum) : 1;

    // Query sản phẩm theo filter và phân trang nếu có
    let query = Product.find(filter)
      .select(
        "_id name  slug avatar  price finalPrice discount type categories "
      )
      .populate("categories", "name slug");

    if (skip !== undefined && limitNum !== undefined) {
      query = query.skip(skip).limit(limitNum);
    }
    const products = await query.lean();
    let favoriteProductIds = [];
    if (userId) {
      const favorites = await Favorites.find({ userId })
        .select("productId")
        .lean();
      favoriteProductIds = favorites.map((f) => f.productId.toString());
    }

    const processedProducts = products.map(product => {
      const isFavorite = favoriteProductIds.includes(product._id.toString());
      
      return {
        ...product,
        isFavorite: isFavorite
      };
    });

    return {
      data: {
        meta: {
          currentPage: pageNum,
          pageSize: limitNum,
          totalItems,
          totalPages,
        },
        result: processedProducts,
      },
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Lỗi khi lọc sản phẩm",
      data: error.message,
    };
  }
};
export const GetRelatedProductsService = async (slug) => {
  try {
    const currentProduct = await Product.findOne({ slug: slug })
      .select("categories type")
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
      type: currentProduct.type,
    })
      .select(
        "name price finalPrice discount avatar images slug type categories variants"
      )
      .populate("categories", "name slug")
      .populate("variants", "color size")
      .limit(5) // Giới hạn 5 sản phẩm
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
        type: product.type,
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
        data: processedResult, // Trả về trực tiếp mảng kết quả
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
export const getTrendingProductsService = async (type) => {
  try {
    let query = {
      isDeleted: false,
    };

    if (type && type !== "ALL") {
      query.type = type;
    }

    // Lấy đơn hàng thành công
    const successOrders = await Order.find({
      status: "pending",
    });

    // Tính số lượng bán của từng sản phẩm
    const productSales = {};
    successOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId.toString();
        productSales[productId] =
          (productSales[productId] || 0) + item.quantity;
      });
    });

    // Lấy thông tin sản phẩm
    const products = await Product.find(query)
      .select("name price discount finalPrice avatar type slug categories")
      .populate("categories", "name")
      .lean();

    // Thêm số lượng bán, lọc sản phẩm đã bán và sắp xếp
    const trendingProducts = products
      .map((product) => ({
        ...product,
        totalSold: productSales[product._id.toString()] || 0,
      }))
      .filter((product) => product.totalSold > 0) // Chỉ lấy sản phẩm đã bán
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 8); // Lấy top 8

    // Kiểm tra nếu không có sản phẩm nào được bán
    if (trendingProducts.length === 0) {
      return {
        statusCode: 404,
        message: "Không có sản phẩm bán chạy nào",
        data: [],
      };
    }

    return {
      data: trendingProducts.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        finalPrice: product.finalPrice,
        discount: product.discount,
        avatar: product.avatar,
        type: product.type,
        slug: product.slug,
        categories: product.categories,
        totalSold: product.totalSold,
      })),
    };
  } catch (error) {
    console.log("Error in getTrendingProductsService:", error);
    return {
      statusCode: 500,
      message: "Lỗi server",
      data: null,
    };
  }
};
