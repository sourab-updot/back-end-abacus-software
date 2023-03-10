const User = require("../models/user.model");
const {
  registerValidation,
  signinValidation,
  verificationValidation,
  updateValidation,
  passwordResetValidation,
  updateBySuperadminValidation,
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
  USER_UPDATED,
  USERS_NOT_FOUND,
  USERNAME_PASSWORD_REQ,
  PASSWORD_NOT_MATCH_ERR,
  PASSWORD_UPDATED,
  USER_ID_REQ,
  NOT_UNIQUE_USERNAME_ERR,
  USERS_REMOVED,
} = require("../constants/response.message");
const { mailTransporter } = require("../configs/mail.transporter");
const { signToken } = require("../configs/jwt.config");
const { _validateUser } = require("../middlewares/_validate.middleware");

// @desc Create user
// @route /api/user/register
// @access Public
const registerUserController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = registerValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check for authorized user
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // To check unique emails
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ message: NOT_UNIQUE_EMAIL_ERR });
  }

  let buffer = Buffer.from(req.body.avatar, "base64");
  const newUser = await new User({
    avatar: buffer,
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString(),
    ...req.body,
  });

  await newUser.save();

  // Send welcome mail
  const mailOptions = {
    from: "sourab@updot.in",
    to: newUser.email,
    subject: "Onboarding confirmation.",
    text: `Greetings from Abacus. Congratulations you have been onboarded as ${newUser.role}. Here's your credentials username ${newUser.username} and password ${req.body.password}.`,
  };
  const mailErr = mailTransporter(mailOptions);
  if (mailErr) {
    return res.status(400).json({ message: MAIL_FAILED_ERR });
  }
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
  user.verification_code = "@#%$&%$#%@%^$%$&^*^&*%^%^%@%@%%@%";
  await user.save();

  res.status(200).json({
    message: USER_ACCESS_GRANTED,
    token: token,
  });
});

// @desc get user
// @route /api/user/getUser
// @access protected
const getUserController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  res.status(200).json({
    ...req.user._doc,
  });
});

// @desc get all user
// @route /api/user/getAllUsers
// @access protected
const getAllUsersController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const usersList = await User.find()
    .select(["-password", "-verification_code", "-__v"])
    .catch((err) => {
      return res.status(400).json({ message: USERS_NOT_FOUND, err });
    });

  res.status(200).json(usersList);
});

// @desc update user
// @route /api/user/update
// @access protected
const updateUserController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = updateValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Check for authorized user
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findById(req.user._id).exec();
  if (!user) {
    return res(400).json({ message: USER_NOT_FOUND_ERR });
  }

  // Destructuring req data
  const { avatar } = req.body;

  // Process image
  let buffer = Buffer.from(avatar, "base64");

  await User.findByIdAndUpdate(req.user._id, {
    avatar: buffer,
    updated_by: req.user._id.toString(),
    ...req.body,
  });

  res.status(200).json({ message: USER_UPDATED });
});

// @desc update user by super admin
// @route /api/user/updateBySuperadmin
// @access protected
const updateUserBySuperadminController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = updateBySuperadminValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Check for authorized user
  if (!req.user || req.user.role !== "Super Admin") {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: USER_ID_REQ });
  }
  const user = await User.findById(req.query.id).exec();
  if (!user) {
    return res(400).json({ message: USER_NOT_FOUND_ERR });
  }

  // Destructuring req data
  const { avatar } = req.body;

  // Process image
  let buffer = Buffer.from(avatar, "base64");

  await User.findByIdAndUpdate(req.query.id, {
    avatar: buffer,
    updated_by: req.user._id.toString(),
    ...req.body,
  });

  res.status(200).json({ message: USER_UPDATED });
});

// @desc update user password
// @route /api/user/passwordReset
// @access protected
const userPasswordResetController = asyncHandler(async (req, res) => {
  // Validate req body
  const { error } = passwordResetValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check for authorized user
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get user
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return res.status(400).json({ message: USER_NOT_FOUND_ERR });
  }
  // Check for current password
  const validPassword = await bcrypt.compareSync(
    req.body.old_password,
    user.password
  );
  if (!validPassword) {
    return res.status(400).json({ message: PASSWORD_NOT_MATCH_ERR });
  }

  user.password = req.body.new_password;
  await user.save();

  // Send password to employee via email
  const mailOptions = {
    from: "sourab@updot.in",
    to: user.email,
    subject: "Password reset complete.",
    text: `Greetings from Abacus. Your password has been updated successfully.`,
  };

  const mailErr = mailTransporter(mailOptions);
  if (mailErr) {
    return res.status(400).json({ message: MAIL_FAILED_ERR });
  }
  res.status(200).json({ message: PASSWORD_UPDATED });
});

// @desc    remove user by id controller
// @route   /api/users/removeUser
// @access  Protected
const removeUserByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser || req.user.role !== "Super Admin") {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: USER_ID_REQ });
  }

  // Get user by id and delete
  const user = await User.findById(req.query.id).exec();

  if (!user) {
    return res.status(400).json({ message: USER_NOT_FOUND_ERR });
  }

  const result = await user.deleteOne();

  res.status(200).json({
    message: `${result.username} "has been removed successfully";`,
  });
});

// @desc    remove users controller
// @route   /api/users/removeUser
// @access  Protected
const removeUsersController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser || req.user.role !== "Super Admin") {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for req body
  if (!req.body.ids || req.body.ids.length === 0) {
    return res.status(400).json({ message: USER_ID_REQ });
  }

  // Get users by id and delete
  await User.deleteMany({
    _id: {
      $in: [...req.body.ids],
    },
  })
    .exec()
    .catch((err) => {
      return res.status(400).json({ message: USERS_NOT_FOUND });
    });

  res.status(200).json({ message: USERS_REMOVED });
});

module.exports = {
  registerUserController,
  signinUserController,
  verifyUserController,
  getUserController,
  getAllUsersController,
  updateUserController,
  updateUserBySuperadminController,
  userPasswordResetController,
  removeUserByIdController,
  removeUsersController,
};
