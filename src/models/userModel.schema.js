import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String
    },
    name: String,
    password: String,
    phoneNumber: { type: Number },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
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
