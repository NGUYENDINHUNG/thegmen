import mongoose from "mongoose";

const { Schema } = mongoose;

const SuppliersSchema = new Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Supplier = mongoose.model("supplier", SuppliersSchema);

export default Supplier;
