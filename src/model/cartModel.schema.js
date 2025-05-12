import mongoose from "mongoose";
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
  variantId: { type: Schema.Types.ObjectId, ref: "variants" },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Cart = mongoose.models.cart || mongoose.model("cart", CartSchema);
export default Cart;
