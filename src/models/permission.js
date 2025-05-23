import mongoose from "mongoose";

const { Schema } = mongoose;

const PermissionSchema = new Schema(
  {
    name: String,
    apiPath: String,
    method: String,
    module: String,
  },
  { timestamps: true }
);

const Permission = mongoose.model("permission", PermissionSchema);

export default Permission;
