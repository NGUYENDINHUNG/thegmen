import mongoose from "mongoose";
const { Schema } = mongoose;

const VoucherSchema = new Schema({
  code: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  discountValue: { type: Number, required: true, min: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  quantity: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  maxUsagePerUser: { type: Number, default: 1 },
});

const Voucher = mongoose.model("voucher", VoucherSchema);

export default Voucher;
