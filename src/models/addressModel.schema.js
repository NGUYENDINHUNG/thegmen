import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    fullname: String,
    phoneNumber: {
      type: String,
      required: true,
    },
    address: String,
    provinceName: String,
    districtName: String,
    wardName: String,
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Address =
  mongoose.models.address || mongoose.model("address", AddressSchema);

export default Address;
