import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true }, // thêm lowercase nếu muốn
    name: String,
    password: String,
    phoneNumber: { type: String, unique: true },
    address: String,
    avatar: String,
    facebookId: String,
    googleId: String,
    avatar: String,
    refreshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
