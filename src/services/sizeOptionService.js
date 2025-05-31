import SizeOption from "../models/sizeOptionModel.schema.js";

export const createSizeOption = async (sizeOptionData) => {
  try {
    const sizeOption = await SizeOption.create(sizeOptionData);
    return sizeOption;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSizeOption = async (sizeOptionId, sizeOptionData) => {
  try {
    const sizeOption = await SizeOption.findByIdAndUpdate(
      sizeOptionId,
      sizeOptionData,
      { new: true }
    );
    return sizeOption;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteSizeOption = async (sizeOptionId) => {
  try {
    const sizeOption = await SizeOption.findByIdAndDelete(sizeOptionId);
    return sizeOption;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSizeOptionById = async (sizeOptionId) => {
  try {
    const sizeOption = await SizeOption.findById(sizeOptionId);
    return sizeOption;
  } catch (error) {
    throw new Error(error);
  }
};
export const getAllSizeOptions = async () => {
  try {
    const sizeOptions = await SizeOption.find();
    return sizeOptions;
  } catch (error) {
    throw new Error(error);
  }
};
