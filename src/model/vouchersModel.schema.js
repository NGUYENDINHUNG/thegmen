import mongoose from "mongoose";
const { Schema } = mongoose;

const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, required: true, min: 0 },
  minProductQuantity: { type: Number, required: true, min: 1 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  quantity: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const VoucherUsageSchema = new Schema(
  {
    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

VoucherUsageSchema.index({ voucherId: 1, userId: 1 }, { unique: true });

const Voucher = mongoose.model("voucher", VoucherSchema);
const VoucherUsage = mongoose.model("voucherUsage", VoucherUsageSchema);

export { Voucher, VoucherUsage };
