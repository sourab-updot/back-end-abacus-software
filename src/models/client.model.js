const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, "created by is required"],
      ref: "user",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, "updated by required"],
      ref: "user",
    },
    company_logo: String,
    company_name: {
      type: String,
      required: [true, "company name is required"],
    },
    representative_name: {
      type: String,
      required: [true, "representative name is required"],
    },
    role: {
      type: String,
      required: [true, "representative role is required"],
    },
    email: {
      type: String,
      required: [true, "email required"],
    },
    mobile_number: {
      type: String,
    },
    address_line: String,
    state: String,
    country: String,
    bank_name: {
      type: String,
      required: [true, "bank name required"],
    },
    bank_account_number: {
      type: String,
      required: [true, "account number required"],
      unique: [true, "account number should be unique"],
    },
    bank_ifsc_code: {
      type: String,
      required: [true, "account number required"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const ClientModel = mongoose.model("client", ClientSchema);
module.exports = ClientModel;
