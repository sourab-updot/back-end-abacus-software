const User = require("../models/user.model");
const {
  registerValidation,
  signinValidation,
  verificationValidation,
} = require("../validations/user.validations");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { uploadFileToS3 } = require("../configs/aws.s3");
const {
  randomBytesGenerator,
  randomIntGenerator,
} = require("../utility/randomCryptoGenerator");
const {
  NOT_UNIQUE_EMAIL_ERR,
  USER_REGISTERED,
  USERNAME_NOT_FOUND_ERR,
  PASSWORD_NOT_VALID_ERR,
  USER_ACCESS_GRANTED,
  MAIL_FAILED_ERR,
  MAIL_SENT_SUCCESS,
  USER_NOT_FOUND_ERR,
  VERIFICATION_FAILED_ERR,
  UNAUTHORIZED_ERR,
} = require("../constants/response.message");
const { mailTransporter } = require("../configs/mail.transporter");
const { signToken } = require("../configs/jwt.config");

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
    return res.status(400).json({ message: NOT_UNIQUE_EMAIL_ERR });
  }

  // Request data
  const {
    first_name,
    last_name,
    mobile_number,
    email,
    username,
    password,
    designation,
    role,
    businessId,
  } = req.body;

  const imageFileName = randomBytesGenerator(16);
  const imageFile = req.file;

  const newUser = new User({
    first_name: first_name,
    last_name: last_name,
    username: username,
    avatar: imageFileName,
    mobile_number: mobile_number,
    email: email,
    password: password,
    designation: designation,
    role: role,
    businessId: businessId,
  });
  await uploadFileToS3(imageFile, imageFileName);
  await newUser.save();
  res.status(200).json({ message: USER_REGISTERED });
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
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }
  const validPassword = await bcrypt.compareSync(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    return res.status(400).json({ message: PASSWORD_NOT_VALID_ERR });
  }

  // Create verification code
  const _verificationCode = randomIntGenerator(3);
  // Save user tabel
  user.verification_code = _verificationCode;
  await user.save();

  // Send code via email
  const mailOptions = {
    from: "sourab@updot.in",
    to: user.email,
    subject: "SignIn Verification Code",
    text: `Greetings from Abacus. Here is your verification code: ${_verificationCode}`,
  };

  const mailErr = mailTransporter(mailOptions);
  if (mailErr) {
    return res.status(400).json({ message: MAIL_FAILED_ERR });
  }
  res.status(200).json({
    employee_id: user.emp_id,
    message: MAIL_SENT_SUCCESS,
  });
});

// @desc Verify user
// @route /api/user/verify
// @access protected
const verifyUserController = asyncHandler(async (req, res) => {
  const { error } = verificationValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // To check username exists
  const user = await User.findOne({ emp_id: req.body.emp_id });
  if (!user) {
    return res.status(400).json({ message: USER_NOT_FOUND_ERR });
  }
  const validCode =
    req.body.verification_code === user.verification_code ? true : false;

  if (!validCode) {
    return res.status(400).json({ message: VERIFICATION_FAILED_ERR });
  }

  // Sign JWT and get token
  const token = signToken({
    emp_id: user.emp_id,
    username: user.username,
    email: user.email,
  });

  // removing code from db after verification is successful
  user.verification_code = "";
  await user.save();

  res.status(200).json({
    message: USER_ACCESS_GRANTED,
    token: token,
  });
});

// @desc get user
// @route /api/user/verify
// @access protected
const getUserController = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }
  const {
    _id,
    emp_id,
    first_name,
    last_name,
    mobile_number,
    email,
    username,
    designation,
    role,
    businessId,
    lastVisited,
  } = req.user;
  res.status(200).json({
    _id,
    emp_id,
    first_name,
    last_name,
    mobile_number,
    email,
    username,
    designation,
    role,
    businessId,
    lastVisited,
  });
});
module.exports = {
  registerUserController,
  signinUserController,
  verifyUserController,
  getUserController,
};
