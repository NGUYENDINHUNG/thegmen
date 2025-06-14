import mongoose from "mongoose";

const { Schema } = mongoose;

const CollectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    products: {
      type: [Schema.Types.ObjectId],
      ref: "products",
      default: [],
    },
    images: {
      type: [String],
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

const Collection = mongoose.model("conlection", CollectionSchema);

export default Collection;
