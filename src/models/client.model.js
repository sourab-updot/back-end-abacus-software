const mongoose = require("mongoose");
const { Schema } = mongoose;

const ClientSchema = new Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    required: [true, "creator of product is required"],
    ref: "user",
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    required: [true, "updator of product is required"],
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
  address: {
    line: String,
    state: String,
    country: String,
  },
  bank: {
    name: {
      type: String,
      required: [true, "bank name required"],
    },
    account_number: {
      type: String,
      required: [true, "account number required"],
      unique: [true, "account number should be unique"],
    },
    ifsc_code: {
      type: String,
      required: [true, "account number required"],
    },
    required: [true, "bank account required"],
  },
});

const ClientModel = mongoose.model("client", ClientSchema);
module.exports = ClientModel;
