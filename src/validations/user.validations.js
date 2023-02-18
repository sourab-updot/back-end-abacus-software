const Joi = require("joi");

// For user registration
const registerValidation = Joi.object({
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  username: Joi.string().min(2).required(),
  avatar: Joi.string().min(2),
  mobile_number: Joi.string().min(4).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(4).required(),
  designation: Joi.string().min(2),
  role: Joi.string().min(2),
  businessId: Joi.number().min(1),
});

// For user signin
const signinValidation = Joi.object({
  username: Joi.string().min(2).required(),
  password: Joi.string().min(4).required(),
});

const verificationValidation = Joi.object({
  emp_id: Joi.string().required(),
  verification_code: Joi.string().required(),
});

const tokenValidation = Joi.object({
  token: Joi.string().required(),
});

// For user update
const updateValidation = Joi.object({
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  avatar: Joi.string().min(2),
  email: Joi.string().min(6).required().email(),
});
module.exports = {
  registerValidation,
  signinValidation,
  verificationValidation,
  tokenValidation,
  updateValidation,
};
