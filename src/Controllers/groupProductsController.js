import {
  createGroupProduct,
  updateGroupProduct,
  deleteGroupProduct,
  getGroupProductById,
  getAllGroupProducts,
} from "../services/groupProductService.js";

export const createGroupProductController = async (req, res) => {
  try {
    const groupProduct = await createGroupProduct(req.body);
    res.status(201).json(groupProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGroupProductController = async (req, res) => {
  try {
    const groupProduct = await updateGroupProduct(req.params.id, req.body);
    res.status(200).json(groupProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroupProductController = async (req, res) => {
  try {
    const groupProduct = await deleteGroupProduct(req.params.id);
    res.status(200).json(groupProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupProductByIdController = async (req, res) => {
  try {
    const groupProduct = await getGroupProductById(req.params.id);
    res.status(200).json(groupProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllGroupProductsController = async (req, res) => {
  try {
    const groupProducts = await getAllGroupProducts();
    res.status(200).json(groupProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
