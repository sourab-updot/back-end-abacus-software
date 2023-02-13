const Joi = require("joi");

// For product
const clientValidation = Joi.object({
  company_name: Joi.string().min(2).required(),
  representative_name: Joi.string().min(2).required(),
  role: Joi.string().min(1).required(),
  mobile_number: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  address: {
    line: Joi.string().min(4).required(),
    state: Joi.string().min(2).required(),
    country: Joi.string().min(2).required(),
  },
  bank: {
    name: Joi.string().min(2).required(),
    account_number: Joi.string().min(2).required(),
    ifsc_code: Joi.string().min(2).required(),
  },
});

module.exports = { clientValidation };
