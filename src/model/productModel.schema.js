import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    variants: {
      type: [Schema.Types.ObjectId],
      ref: "variants",
      default: [],
    },
    collections: {
      type: [Schema.Types.ObjectId],
      ref: "conlection",
      default: [],
    },
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "suppliers",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "categories",
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
