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
      validate: {
        validator: function (v) {
          return /^(0)(3|5|7|8|9)[0-9]{8}$/.test(v);
        },
        message: (props) =>
          `${props.value} không phải là số điện thoại hợp lệ!`,
      },
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
