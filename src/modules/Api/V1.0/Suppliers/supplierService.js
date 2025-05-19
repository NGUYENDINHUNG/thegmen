import SupplierModel from "../../../../models/supplierModel.schema.js";

export const CreateSupplierService = async (name, slug) => {
  try {
    let result = await SupplierModel.create({
      name: name,
    });
    return result;
  } catch (error) {}
};
export const UpdateSupplierService = async (SupplierId, updateData) => {
  try {
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      SupplierId,
      { $set: updateData },
      { new: true }
    );
    return updatedSupplier;
  } catch (error) {
    throw new Error(error.message || "Lỗi khi cập nhật danh mục.");
  }
};
