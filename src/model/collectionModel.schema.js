import mongoose from "mongoose";

const { Schema } = mongoose;

const ConllectionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    products: String,
    images: String,
  },
  { timestamps: true }
);

const Conllection = mongoose.model("conlection", ConllectionSchema);

export default Conllection;
