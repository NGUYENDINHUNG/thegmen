import mongoose from "mongoose";

const { Schema } = mongoose;

const SizeSuggestCategorySchema = new Schema(
  {
    type: { type: String, unique: true },
    sizeOptions: {
      type: [Schema.Types.ObjectId],
      ref: "sizeOption",
      required: true,
    },
    images: { type: String },
  },
  { timestamps: true }
);

const SizeSuggestCategory = mongoose.model(
  "sizeSuggestCategories",
  SizeSuggestCategorySchema
);

export default SizeSuggestCategory;
