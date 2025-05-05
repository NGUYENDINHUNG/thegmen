import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: String,
    slug: String,
  },
  { timestamps: true }
);

const Category = mongoose.model("category", CategorySchema);

export default Category;
