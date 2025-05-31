import GroupProduct from "../models/groupProduct.schema.js";

export const createGroupProduct = async (groupProductData) => {
  const groupProduct = await GroupProduct.create(groupProductData);
  return groupProduct;
};

export const updateGroupProduct = async (groupProductId, groupProductData) => {
  const groupProduct = await GroupProduct.findByIdAndUpdate(
    groupProductId,
    groupProductData
  );
  return groupProduct;
};

export const deleteGroupProduct = async (groupProductId) => {
  const groupProduct = await GroupProduct.findByIdAndDelete(groupProductId);
  return groupProduct;
};

export const getGroupProductById = async (groupProductId) => {
  const groupProduct = await GroupProduct.findById(groupProductId);
  return groupProduct;
};

export const getAllGroupProducts = async () => {
  const groupProducts = await GroupProduct.find();
  return groupProducts;
};
