import Variant from "../models/variantsModel.schema.js";
import Product from "../models/productModel.schema.js";
import aqp from "api-query-params";

export const createVariantService = async (
  color,
  images,
  size,
  stock,
  sku,
  Products,
) => {
  try {
    const existProduct = await Product.findOne({
      _id: Products,
      isDeleted: false,
    });
    if (!existProduct) {
      throw new Error("Sản phẩm không tồn tại hoặc đã bị xóa");
    }
    const newVariant = await Variant.create({
      color,
      images,
      size,
      stock,
      sku,
      Products,
    });

    await Product.findByIdAndUpdate(Products, {
      $push: { variants: newVariant._id },
    });

    return newVariant;
  } catch (error) {
    console.error("Error in createVariantService:", error);
    throw error;
  }
};

export const updateVariantService = async (variantId, updateData) => {
  try {
    const updatedVariant = await Variant.findByIdAndUpdate(
      variantId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedVariant) {
      throw new Error("Biến thể không tồn tại hoặc đã bị xóa");
    }

    return updatedVariant;
  } catch (error) {
    console.error("Error in updateVariantService:", error);
    throw error;
  }
};

export const getVariantByIdService = async (variantId) => {
  try {
    const variant = await Variant.findOne({ _id: variantId, isDeleted: false });

    if (!variant) {
      throw new Error("Biến thể không tồn tại hoặc đã bị xóa");
    }

    return variant;
  } catch (error) {
    console.error("Error in getVariantByIdService:", error);
    throw error;
  }
};

export const getVariantsByProductIdService = async (productId) => {
  try {
    const variants = await Variant.find({
      productId: productId,
      isDeleted: false,
    });

    return variants;
  } catch (error) {
    console.error("Error in getVariantsByProductIdService:", error);
    throw error;
  }
};

export const getAllVariantsService = async (
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

      result = await Variant.find(filter).skip(offset).limit(pageSize).exec();
    } else {
      result = await Variant.find({ isDeleted: false });
    }
    return result;
  } catch (error) {
    console.error("Error in getAllVariantsService:", error);
    throw error;
  }
};

export const softDeleteVariantService = async (variantId) => {
  try {
    // Tìm biến thể cần xóa
    const variant = await Variant.findById(variantId);

    if (!variant) {
      throw new Error("Biến thể không tồn tại hoặc đã bị xóa");
    }

    const productId = variant.productId;

    const deletedVariant = await Variant.findByIdAndUpdate(
      variantId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );
    await Product.findByIdAndUpdate(productId, {
      $pull: { variants: variantId },
    });

    return deletedVariant;
  } catch (error) {
    console.error("Error in softDeleteVariantService:", error);
    throw error;
  }
};

export const restoreVariantService = async (variantId) => {
  try {
    const variant = await Variant.findById(variantId);

    if (!variant) {
      throw new Error("Biến thể không tồn tại");
    }

    const productId = variant.productId;

    const restoredVariant = await Variant.findByIdAndUpdate(
      variantId,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    await Product.findByIdAndUpdate(productId, {
      $addToSet: { variants: variantId },
    });
    return restoredVariant;
  } catch (error) {
    console.error("Error in restoreVariantService:", error);
    throw error;
  }
};
