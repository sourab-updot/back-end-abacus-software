const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
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
    company_name: {
      type: String,
      required: [true, "company name is required"],
    },
    representative_name: {
      type: String,
      required: [true, "representative name is required"],
    },
    date: {
      type: Date,
      required: [true, "date is required"],
    },
    payment_type: {
      type: String,
      required: [true, "payment type is required"],
    },
    amount: {
      type: String,
      required: [true, "amount s required"],
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const PaymentModel = mongoose.model("payment", ProductSchema);
module.exports = PaymentModel;
