import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
    },
    images: {
      type: String,
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      unique: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

CategorySchema.virtual("products", {
  ref: "products",
  localField: "_id",
  foreignField: "categoryId",
  justOne: false,
  match: { isDeleted: false },
});

const Category = mongoose.model("categories", CategorySchema);

export default Category;
