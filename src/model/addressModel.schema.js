import mongoose from "mongoose";

const { Schema } = mongoose;

const AddressSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullname: String,
    phoneNumber: String,
    address: String,
    provinceName: String,
    districtName: String,
    wardName: String,
    isDefault: Boolean,
  },
  { timestamps: true }
);

const Address = mongoose.model("address", AddressSchema);

export default Address;
