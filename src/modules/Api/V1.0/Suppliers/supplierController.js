import {
  CreateSupplierService,
  UpdateSupplierService,
} from "./supplierService.js";

export const CreateSupplier = async (req, res) => {
  const { name } = req.body;
  const data = await CreateSupplierService(name);
  return res.status(200).json({
    statusCode: 200,
    message: "Create slider successfully",
    data: data,
  });
};
export const UpdateCategory = async (req, res) => {
  try {
    const SupplierId = req.params.id;
    const { name } = req.body;
    const updated = await UpdateSupplierService(SupplierId, { name });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
