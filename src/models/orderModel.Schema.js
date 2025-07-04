import mongoose from "mongoose";
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "products", required: true },
  variantId: { type: Schema.Types.ObjectId, ref: "variants" },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    voucherDiscount: { type: Number, default: 0 },
    voucherId: {
      id: { type: Schema.Types.ObjectId, ref: "voucher" },
      code: { type: String },
      discountType: { type: String },
      discountValue: { type: Number },
      discountAmount: { type: Number },
    },
    shippingAddress: {
      fullName: String,
      phoneNumber: String,
      province: String,
      district: String,
      ward: String,
      address: String,
    },
    orderCode: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Momo", "ZaloPay", "VNPay"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", OrderSchema);

export default Order;
