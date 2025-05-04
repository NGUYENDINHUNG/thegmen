import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true },
    name: String,
    password: String,
    phoneNumber: String,
    address: String,
    avatar: String,
    facebookId: String,
    googleId: String,
    refreshToken: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", UserSchema);

export default User;
