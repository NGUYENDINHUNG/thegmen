import mongoose from "mongoose";

const favoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoritesSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorites = mongoose.model("Favorites", favoritesSchema);
export default Favorites;
