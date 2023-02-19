const mongoose = require("mongoose");
const { Schema } = mongoose;

const BusinessSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "user is required"],
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
    phone_number: {
      type: String,
      required: [true, "phone number is required"],
    },
    mobile_number: {
      type: String,
      required: [true, "mobile number is required"],
    },
    address_line1: {
      type: String,
      require: [true, "address, is required"],
    },
    address_line2: {
      type: String,
    },
    city: {
      type: String,
      required: [true, "city name is required"],
    },
    state: {
      type: String,
      required: [true, "state name is required"],
    },
    pincode: {
      type: String,
      required: [true, "pincode name is required"],
    },
    country: {
      type: String,
      required: [true, "country name is required"],
    },
    base_currency: {
      type: String,
    },
    timezone: {
      type: String,
    },
    fiscal_month: {
      type: String,
    },
    fiscal_day: {
      type: String,
    },
    date_format: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const BusinessModel = mongoose.model("business", BusinessSchema);
module.exports = BusinessModel;
