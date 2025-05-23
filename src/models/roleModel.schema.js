import mongoose from "mongoose";

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Role = mongoose.model("role", RoleSchema);

export default Role;
