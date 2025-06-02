import mongoose from "mongoose";

const { Schema } = mongoose;

const GroupProductSchema = new Schema({
  groupKey: {
    type: String,
    required: true,
  },
  color: {
    type: String,
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
});

const GroupProduct = mongoose.model("groupProducts", GroupProductSchema);

export default GroupProduct;
