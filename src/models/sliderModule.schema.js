import mongoose from "mongoose";

const { Schema } = mongoose;

const SliderSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    linkUrl: {
      type: String,
    },
    position: {
      type: Number,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Sliders = mongoose.model("sliders", SliderSchema);

export default Sliders;
