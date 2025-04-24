import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true }, // thêm lowercase nếu muốn
    name: String,
    password: String,
    phoneNumber: String,
    address: String,
    avatar: String,
    facebookId: String,
    googleId: String,
    avatar: String,
    refeshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
