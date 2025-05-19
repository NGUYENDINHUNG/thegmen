import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: String,
    slug: String,
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
  { timestamps: true }
);
CategorySchema.virtual("products", {
  ref: "product",
  localField: "_id",
  foreignField: "categoryId",
  justOne: false,
  match: { isDeleted: false },
});
const Category = mongoose.model("category", CategorySchema);

export default Category;
