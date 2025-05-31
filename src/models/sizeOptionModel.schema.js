import mongoose from "mongoose";

const { Schema } = mongoose;

const SizeOptionSchema = new Schema(
  {
    name: { type: String },
    minHeight: { type: Number },
    maxHeight: { type: Number },
    back: { type: Number },
    butt: { type: Number },
    long: { type: Number },
    chest: { type: Number },
    shoulder: { type: Number },
  },
  { timestamps: true }
);

const SizeOption = mongoose.model("sizeOption", SizeOptionSchema);

export default SizeOption;
