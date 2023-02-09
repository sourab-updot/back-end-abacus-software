const Business = require("../models/business.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { detailsValidation } = require("../validations/business.validations");
const {
  USERNAME_NOT_FOUND_ERR,
  BUSINESS_DETAILS_ADDED,
  BUSINESS_DETAILS_USER_NOT_FOUND,
  BUSINESS_DETAILS_UPDATED,
  BUSINESS_DETAILS_DELETED,
  UNAUTHORIZED_ERR,
} = require("../constants/response.message");

// @desc    add details
// @route   /api/business/addDetails
// @access  Protected
const addDetailController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = detailsValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // To check user exists
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  const business = await Business.findOne({ user: user._id });
  if (business) {
    return res.status(400).json({
      message: BUSINESS_DETAILS_ALREADY_EXISTS,
    });
  }

  const newBusinessDetails = new Business({
    user: user._id.toString(),
    ...req.body,
  });
  await newBusinessDetails.save();
  res.status(200).json({ message: BUSINESS_DETAILS_ADDED });
});

// @desc    get details by userId
// @route   /api/business/getDetailsByUser
// @access  Protected
const getDetailsByUserController = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  const business = await Business.findOne({ user: user._id }).populate({
    path: "user",
    select: [
      "-password",
      "-verification_code",
      "-created_at",
      "-updated_at",
      "-__v",
    ],
  });
  if (!business) {
    return res.status(400).json({
      message: BUSINESS_DETAILS_USER_NOT_FOUND,
    });
  }
  res.status(200).json({ business });
});

// @desc    update details by userId
// @route   /api/business/updateDetailsByUser
// @access  Protected
const updateDetailsByUserController = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  const business = await Business.findOneAndUpdate(
    { user: user._id },
    req.body
  );

  if (!business) {
    return res.status(400).json({
      message: BUSINESS_DETAILS_USER_NOT_FOUND,
    });
  }
  res.status(200).json({ message: BUSINESS_DETAILS_UPDATED });
});

// @desc    delete details by userId
// @route   /api/business/deleteDetailsByUser
// @access  Protected
const deleteDetailsByUserController = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  const business = await Business.findOneAndRemove({ user: user._id });

  if (!business) {
    return res.status(400).json({
      message: BUSINESS_DETAILS_USER_NOT_FOUND,
    });
  }
  res.status(200).json({ message: BUSINESS_DETAILS_DELETED });
});
module.exports = {
  addDetailController,
  getDetailsByUserController,
  updateDetailsByUserController,
  deleteDetailsByUserController,
};
