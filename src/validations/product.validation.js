const Joi = require("joi");

// For product
const productValidation = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(6).required(),
  price: Joi.number().required(),
  quantity: Joi.number(),
  totalQty: Joi.number(),
  sku: Joi.string().min(1),
  stock_status: Joi.string().min(1).required(),
});

module.exports = { productValidation };
