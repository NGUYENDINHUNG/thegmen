import Collection from "../model/collectionModel.schema.js";
import Product from "../model/productModel.schema.js";
import aqp from "api-query-params";

export const CreateCollectionService = async (
  name,
  slug,
  description,
  images = []
) => {
  try {
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

export const UpdateCollectionService = async (collectionId, updateData) => {
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedCollection) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }

    return updatedCollection;
  } catch (error) {
    console.error("Error in UpdateCollectionService:", error);
    throw new Error(error.message || "Lỗi khi cập nhật bộ sưu tập.");
  }
};

export const GetCollectionByIdService = async (collectionId) => {
  try {
    if (!collectionId) {
      return null;
    }
    const results = await Collection.findOne({
      _id: collectionId,
      // isDeleted: false,
    }).populate("products");

    return results;
  } catch (error) {
    console.error("Lỗi khi tìm collection theo ID:", error);
    throw error;
  }
};

export const GetAllCollectionService = async (
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

      result = await Collection.find(filter)
        .skip(offset)
        .limit(pageSize)
        .exec();
    } else {
      result = await Collection.find({ isDeleted: false });
    }
    return result;
  } catch (error) {
    console.log("Error in GetAllCollectionService:", error);
    return null;
  }
};

export const SoftDeleteCollectionService = async (collectionId) => {
  try {
    const collection = await Collection.findById(collectionId);

    if (!collection || collection.isDeleted) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }
    const productIds = collection.products;

    const deletedCollection = await Collection.findByIdAndUpdate(
      collectionId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    // Cập nhật danh sách bộ sưu tập trong mỗi sản phẩm
    if (productIds && productIds.length > 0) {
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $pull: { collections: collectionId } }
      );
    }

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
      //isDeleted: false,
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
    await Product.findByIdAndUpdate(productId, {
      $addToSet: { collections: collectionId },
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

export const GetProductsByCollectionIdService = async (
  collectionId,
  pageSize,
  currentPage
) => {
  try {
    const collection = await Collection.findOne({
      _id: collectionId,
      // isDeleted: false,
    });

    if (!collection) {
      throw new Error("Bộ sưu tập không tồn tại hoặc đã bị xóa");
    }

    let query = Product.find({
      _id: { $in: collection.products },
      isDeleted: false,
    });

    if (pageSize && currentPage) {
      let offset = (currentPage - 1) * pageSize;
      query = query.skip(offset).limit(pageSize);
    }
    const products = await query.exec();

    return products;
  } catch (error) {
    console.error("Error in GetProductsByCollectionIdService:", error);
    throw error;
  }
};

export const GetCollectionsByProductIdService = async (productId) => {
  try {
    const product = await Product.findOne({
      _id: productId,
      //isDeleted: false
    });

    if (!product) {
      throw new Error("Sản phẩm không tồn tại hoặc đã bị xóa");
    }
    const collections = await Collection.find({
      _id: { $in: product.collections },
      isDeleted: false,
    });

    return collections;
  } catch (error) {
    console.error("Error in GetCollectionsByProductIdService:", error);
    throw error;
  }
};
