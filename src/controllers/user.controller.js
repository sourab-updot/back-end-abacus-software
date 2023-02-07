const User = require("../models/user.model");
const {
  registerValidation,
  signinValidation,
} = require("../validations/user.validations");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

// @desc Create user
// @route /api/user/register
// @access Public
const registerUserController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // To check unique emails
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ message: "Email already exists!" });
  }

  const {
    first_name,
    last_name,
    mobile_number,
    email,
    avatar,
    username,
    password,
    designation,
    role,
    businessId,
  } = req.body;

  const newUser = new User({
    first_name: first_name,
    last_name: last_name,
    username: username,
    avatar: avatar,
    mobile_number: mobile_number,
    email: email,
    password: password,
    designation: designation,
    role: role,
    businessId: businessId,
  });

  await newUser.save();
  res.status(200).json({ message: "User created successfully!" });
});

// @desc Signin user
// @route /api/user/signin
// @access Public
const signinUserController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = signinValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // To check username exists
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res
      .status(400)
      .json({ message: "No user found with this username. Try again." });
  }
  const validPassword = await bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    return res.status(400).json({ message: "Password is invalid. Try again." });
  }

  res.status(200).json({ message: "Access Granted." });
});

module.exports = { registerUserController, signinUserController };
