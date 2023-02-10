const PaymentModel = require("../models/payment.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const { UNAUTHORIZED_ERR } = require("../constants/response.message");
const { paymentValidation } = require("../validations/payment.validation");

// @desc    add payment controller
// @route   /api/category/addPayment
// @access  Protected
exports.addPaymentController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = paymentValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const newPayment = await new PaymentModel({
    created_by: req.user._id,
    updated_by: req.user._id,
    ...req.body,
  });

  newPayment.save();
  res.status(200).json({
    message: "Payment record created successfully.",
  });
});

// @desc    get all payments
// @route   /api/category/getAllPayments
// @access  Protected
exports.getAllPaymentsController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const allPayments = await PaymentModel.find().catch(() => {
    res.status(400).json({ message: "No payment record found." });
  });

  res.status(200).json(allPayments);
});

// @desc    get payment by id
// @route   /api/category/getPaymentById
// @access  Protected
exports.getPaymentByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: "Payment Id is required." });
  }

  const paymentRecord = await PaymentModel.findById(req.query.id).catch(() => {
    res.status(400).json({ message: "No payment record found." });
  });

  res.status(200).json(paymentRecord);
});

// @desc    update payment by id
// @route   /api/category/updatePayment
// @access  Protected
exports.updatePaymentController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: "Payment Id is required." });
  }

  await PaymentModel.findByIdAndUpdate(req.query.id, {
    updated_by: req.user._id.toString(),
    ...req.body,
  }).catch(() => {
    res.status(400).json({ message: "No payment record found." });
  });

  res.status(200).json("Payment record updated successfully");
});

// @desc    delete payment by id
// @route   /api/category/deletePayment
// @access  Protected
exports.deletePaymentByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: "Payment Id is required." });
  }

  await PaymentModel.findByIdAndDelete(req.query.id).catch(() => {
    res.status(400).json({ message: "No payment record found." });
  });

  res.status(200).json({ message: "Payment record deleted successfully." });
});
