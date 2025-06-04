import mongoose from "mongoose";

const { Schema } = mongoose;

const VariantsSchema = new Schema(
  {
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    stock: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    Products: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
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

const Variants = mongoose.model("variants", VariantsSchema);

export default Variants;