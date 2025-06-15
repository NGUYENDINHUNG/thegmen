import slugify from "slugify";
import Collection from "../models/collectionModel.schema.js";
import Product from "../models/productModel.schema.js";

export const CreateCollectionService = async (
  name,
  subTitle,
  description,
  images = []
) => {
  try {
    const slug = slugify(name, { lower: true, strict: true, locale: "vi" });
    let result = await Collection.create({
      name: name,
      slug: slug,
      description: description,
      images: images,
    });

    return result;
  } catch (error) {
    console.error("Error in CreateCollectionService:", error);
    throw error;
  }
};

export const UpdateCollectionService = async (slug, updateData, imageUrl) => {
  try {
    if (!slug) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }
    if (imageUrl) {
      updateData.images = imageUrl;
    }
    const updatedCollection = await Collection.findOneAndUpdate(
      { slug: slug },
      { $set: updateData },
      { new: true }
    );

    if (!updatedCollection) {
      throw new Error("lỗi khi cập nhật bộ sưu tập");
    }

    return updatedCollection;
  } catch (error) {
    console.error("Error in UpdateCollectionService:", error);
    throw new Error(error.message || "Lỗi khi cập nhật bộ sưu tập.");
  }
};

export const GetCollectionByIdService = async (slug) => {
  try {
    if (!slug) {
      throw new Error("bộ sưu tập không tồn tại");
    }
    const results = await Collection.findOne(
      {
        slug: slug,
      },
      "name slug description images"
    ).populate("products");
    if (!results) {
      throw new Error("loi khi lay du lieu");
    }
    return results;
  } catch (error) {
    console.error("Lỗi khi tìm collection theo ID:", error);
    throw error;
  }
};
export const GetAllCollectionsService = async () => {
  try {
    const collections = await Collection.find(
      { isDeleted: false },
      "-__v -createdAt -updatedAt -isDeleted -deletedAt"
    );
    return collections;
  } catch (error) {
    console.error("Error in GetAllCollectionsService:", error);
    throw error;
  }
};

export const SoftDeleteCollectionService = async (collectionId) => {
  try {
    const collection = await Collection.findById(collectionId);

    if (!collection || collection.isDeleted) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }

    const deletedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    return deletedCollection;
  } catch (error) {
    console.error("Error in SoftDeleteCollectionService:", error);
    throw error;
  }
};

export const RestoreCollectionService = async (collectionId) => {
  try {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      throw new Error("Bộ sưu tập không tồn tại");
    }
    const productIds = collection.products;

    // Khôi phục bộ sưu tập
    const restoredCollection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    // Cập nhật danh sách bộ sưu tập trong mỗi sản phẩm
    if (productIds && productIds.length > 0) {
      for (const productId of productIds) {
        await Product.findByIdAndUpdate(productId, {
          $addToSet: { collections: collectionId },
        });
      }
    }

    return restoredCollection;
  } catch (error) {
    console.error("Error in RestoreCollectionService:", error);
    throw error;
  }
};

export const AddProductToCollectionService = async (
  collectionId,
  productId
) => {
  try {
    const collection = await Collection.findOne({
      _id: collectionId,
      isDeleted: false,
    });

    if (!collection) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }
    const product = await Product.findOne({ _id: productId, isDeleted: false });

    if (!product) {
      throw new Error("Sản phẩm không tồn tại hoặc đã bị xóa");
    }
    await Collection.findByIdAndUpdate(collectionId, {
      $addToSet: { products: productId },
    });

    return { message: "Thêm sản phẩm vào bộ sưu tập thành công" };
  } catch (error) {
    console.error("Error in AddProductToCollectionService:", error);
    throw error;
  }
};

export const RemoveProductFromCollectionService = async (
  collectionId,
  productId
) => {
  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      throw new Error("Bộ sưu tập không tồn tại");
    }
    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Sản phẩm không tồn tại");
    }
    await Collection.findByIdAndUpdate(collectionId, {
      $pull: { products: productId },
    });
    await Product.findByIdAndUpdate(productId, {
      $pull: { collections: collectionId },
    });

    return { message: "Xóa sản phẩm khỏi bộ sưu tập thành công" };
  } catch (error) {
    console.error("Error in RemoveProductFromCollectionService:", error);
    throw error;
  }
};

export const GetProductsByCollectionSlugService = async (
  slug,
  pageSize,
  currentPage
) => {
  try {
    const collection = await Collection.findOne({
      slug: slug,
      isDeleted: false,
    });

    if (!collection) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }

    let query = Product.find({
      _id: { $in: collection.products },
      isDeleted: false,
    })
      .select("_id name slug price finalPrice avatar images TYPE")
      .populate("categories", "name slug")
      .populate("variants", "color size");

    // Xử lý pagination
    if (pageSize && currentPage) {
      const offset = (currentPage - 1) * pageSize;
      query = query.skip(offset).limit(pageSize);
    }

    const products = await query.lean();

    const processedResult = products.map((product) => {
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
    }

    return processedResult;
  } catch (error) {
    console.error("GetProductsByCollectionSlugService error:", error);
    return {
      EC: 500,
      EM: "Lỗi server, vui lòng thử lại sau",
      data: null,
    };
  }
};
