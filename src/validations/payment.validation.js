const Joi = require("joi");

// For payment
const paymentValidation = Joi.object({
  company_name: Joi.string().min(2).required(),
  representative_name: Joi.string().min(2).required(),
  date: Joi.date().required(),
  payment_type: Joi.string().min(1).required(),
  amount: Joi.string().min(1).required(),
  note: Joi.string(),
});

module.exports = { paymentValidation };
