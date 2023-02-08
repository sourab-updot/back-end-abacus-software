const Business = require("../models/business.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { addDetailsValidation } = require("../validations/business.validations");
const {
  USERNAME_NOT_FOUND_ERR,
  BUSINESS_DETAILS_ADDED,
  BUSINESS_DETAILS_USER_NOT_FOUND,
} = require("../constants/response.message");

// @desc    add detailes
// @route   /api/business/addDetails
// @access  Protected
const addDetailController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = addDetailsValidation.validate(req.body);
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

  const newBusinessDetails = new Business({
    user: user._id,
    ...req.body,
  });
  await newBusinessDetails.save();
  res.status(200).json({ message: BUSINESS_DETAILS_ADDED });
});

// @desc    get detaile by userId
// @route   /api/business/getDetailsByUser
// @access  Protected
const getDetailsByUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  const business = await Business.findOne({ user: user._id });
  if (!business) {
    return res.status(400).json({
      message: BUSINESS_DETAILS_USER_NOT_FOUND,
    });
  }
  res.status(200).json({ business });
});
module.exports = {
  addDetailController,
  getDetailsByUser,
};
