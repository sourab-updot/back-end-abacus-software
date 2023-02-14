const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    created_by: {
      type: Schema.Types.ObjectId,
      required: [true, "created by is required"],
      ref: "user",
    },
    updated_by: {
      type: Schema.Types.ObjectId,
      required: [true, "updated by is required"],
      ref: "user",
    },
    company_logo: String,
    issued_by_company_name: {
      type: String,
      required: [true, "issuer's company name is required"],
    },
    issued_by_mobile_number: {
      type: String,
      required: [true, "issuer's mobile number is required"],
    },
    issued_by_address_line_one: {
      type: String,
    },
    issued_by_address_line_two: {
      type: String,
    },
    issued_by_city: {
      type: String,
    },
    issued_by_state: {
      type: String,
    },
    issued_by_pincode: {
      type: String,
    },
    issued_by_country: {
      type: String,
    },
    billed_to_company_name: {
      type: String,
      required: [true, "billed company name is required"],
    },
    billed_to_mobile_number: {
      type: String,
      required: [true, "billed mobile number is required"],
    },
    billed_to_address_line_one: {
      type: String,
    },
    billed_to_address_line_two: {
      type: String,
    },
    billed_to_city: {
      type: String,
    },
    billed_to_state: {
      type: String,
    },
    billed_to_pincode: {
      type: String,
    },
    billed_to_country: {
      type: String,
    },
    invoice_number: {
      type: String,
      required: [true, "invoice number is required"],
    },
    issue_date: String,
    due_date: String,
    amount_due: String,
    status: {
      type: String,
      required: [true, "invoice status is required"],
    },
    notes: String,
    custom_info: Array,
    invoice: Array,
    total_amount: String,
    additional_charges: String,
    vat: String,
    discount: String,
    payable: String,
    bank_name: {
      type: String,
      required: [true, "bank name required"],
    },
    bank_account_number: {
      type: String,
      required: [true, "account number required"],
    },
    bank_ifsc_code: {
      type: String,
      required: [true, "account number required"],
    },
    attachments: [
      {
        filename: String,
        user: { type: Schema.Types.ObjectId, ref: "user" },
      },
    ],
    terms: String,
    payment_terms: String,
    // Section wise
    section_wise: Array,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const InvoiceModel = mongoose.model("invoice", InvoiceSchema);
module.exports = InvoiceModel;
