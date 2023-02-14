const Joi = require("joi");

// For product
const invoiceValidation = Joi.object({
  issued_by_company_name: Joi.string().min(2).required(),
  issued_by_mobile_number: Joi.string().min(6).required(),
  billed_to_company_name: Joi.string().min(2).required(),
  billed_to_mobile_number: Joi.string().min(6).required(),
  bank_name: Joi.string().min(2).required(),
  bank_account_number: Joi.string().min(2).required(),
  bank_ifsc_code: Joi.string().min(2).required(),
  // Not required fields
  issued_by_address_line_one: Joi.string(),
  issued_by_address_line_two: Joi.string(),
  issued_by_city: Joi.string(),
  issued_by_state: Joi.string(),
  issued_by_pincode: Joi.string(),
  issued_by_country: Joi.string(),
  billed_to_address_line_one: Joi.string(),
  billed_to_address_line_two: Joi.string(),
  billed_to_city: Joi.string(),
  billed_to_state: Joi.string(),
  billed_to_pincode: Joi.string(),
  billed_to_country: Joi.string(),
  invoice_number: Joi.string().required(),
  issue_date: Joi.string(),
  due_date: Joi.string(),
  amount_due: Joi.string(),
  status: Joi.string().required(),
  notes: Joi.string(),
  custom_info: Joi.array(),
  invoice: Joi.array(),
  total_amount: Joi.string(),
  additional_charges: Joi.string(),
  vat: Joi.string(),
  discount: Joi.string(),
  payable: Joi.string(),
  terms: Joi.string(),
  payment_terms: Joi.string(),
  section_wise: Joi.array(),
});

module.exports = { invoiceValidation };
