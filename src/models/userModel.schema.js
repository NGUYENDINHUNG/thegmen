import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    name: String,
    password: String,
    phoneNumber: String,
    address: {
      id: { type: mongoose.Schema.Types.ObjectId },
      fullname: { type: String },
      phoneNumber: { type: String },
      address: { type: String },
      provinceName: { type: String },
      districtName: { type: String },
      wardName: { type: String },
      isDefault: { type: Boolean, default: false },
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
    avatar: String,
    facebookId: String,
    googleId: String,
    refreshToken: String,
    order: [{ type: Schema.Types.ObjectId, ref: "order" }],
    usedVouchers: [
      {
        voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "voucher" },
        usageCount: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
