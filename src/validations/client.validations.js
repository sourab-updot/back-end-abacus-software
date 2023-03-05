const Joi = require("joi");

// For product
const clientValidation = Joi.object({
  company_logo: Joi.string().min(0),
  company_name: Joi.string().min(2).required(),
  representative_name: Joi.string().min(2).required(),
  role: Joi.string().min(1).required(),
  mobile_number: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  address_line: Joi.string().min(0),
  state: Joi.string().min(0),
  country: Joi.string().min(0),
  bank_name: Joi.string().min(2).required(),
  bank_account_number: Joi.string().min(2).required(),
  bank_ifsc_code: Joi.string().min(2).required(),
});

module.exports = { clientValidation };
