import mongoose from "mongoose";

const { Schema } = mongoose;

const VariantsSchema = new Schema(
  {
    size: {
      type: String,
    },
    stock: {
      type: Number,
    },
    sku: {
      type: String,
    },
    position: {
      type: Number,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "products",
      required: true,
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
