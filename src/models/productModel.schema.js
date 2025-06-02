import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    slug: {
      type: String,
    },
    color: {
      type: String,
    },
    avatar: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      default: "PERCENTAGE",
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    variants: {
      type: [Schema.Types.ObjectId],
      ref: "variants",
      default: [],
    },
    featured: { type: Boolean, default: false },
    categories: {
      type: [Schema.Types.ObjectId],
      ref: "categories",
      default: [],
    },
    sizeSuggestCategories: {
      type: [Schema.Types.ObjectId],
      ref: "sizeSuggestCategories",
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", ProductSchema);

export default Product;
