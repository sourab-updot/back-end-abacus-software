const Joi = require("joi");

// For user registration
const detailsValidation = Joi.object({
  name: Joi.string().min(2).required(),
  phone_number: Joi.string().min(4).required(),
  mobile_number: Joi.string().min(4).required(),
  address_line1: Joi.string().min(3).required(),
  address_line2: Joi.string(),
  city: Joi.string().min(1).required(),
  state: Joi.string().min(1).required(),
  pincode: Joi.string().min(3).required(),
  country: Joi.string().min(2).required(),
  base_currency: Joi.string(),
  timezone: Joi.string(),
  fiscal_month: Joi.string(),
  fiscal_day: Joi.string(),
  date_format: Joi.string(),
});

module.exports = { detailsValidation };
