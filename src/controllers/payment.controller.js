const PaymentModel = require("../models/payment.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const {
  UNAUTHORIZED_ERR,
  PAYMENT_CREATED,
  PAYMENT_NOT_FOUND,
  PAYMENT_ID_NOT_FOUND,
  PAYMENT_UPDATED,
  PAYMENT_DELETED,
} = require("../constants/response.message");
const { paymentValidation } = require("../validations/payment.validation");

// @desc    add payment controller
// @route   /api/category/addPayment
// @access  Protected
exports.addPaymentController = asyncHandler(async (req, res) => {
  // Validate req data
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
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString(),
    ...req.body,
  });

  newPayment.save();
  res.status(200).json({
    message: PAYMENT_CREATED,
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

  // Destructuring request query
  const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;

  const generateSort = () => {
    const parsedSort = JSON.parse(sort);
    const sortFormatted = {
      [parsedSort.field]: (parsedSort.sort = "asc" ? 1 : -1),
    };
    return sortFormatted;
  };

  const sortFormatted = Boolean(sort) ? generateSort() : {};

  const allPayments = await PaymentModel.find({
    $or: [
      { date: { $regex: new RegExp(search, "i") } },
      { payment_type: { $regex: new RegExp(search, "i") } },
      { amount: { $regex: new RegExp(search, "i") } },
    ],
  })
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize)
    .populate({
      path: "client",
      select: ["-created_at", "-updated_at", "-__v"],
    })
    .exec();
  if (!allPayments) {
    return res.status(400).json({ message: PAYMENT_NOT_FOUND });
  }

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
    return res.status(400).json({ message: PAYMENT_ID_NOT_FOUND });
  }

  const paymentRecord = await PaymentModel.findById(req.query.id)
    .populate({
      path: "client",
      select: ["-created_at", "-updated_at", "-__v"],
    })
    .catch(() => {
      res.status(400).json({ message: PAYMENT_NOT_FOUND });
    });

  res.status(200).json(paymentRecord);
});

// @desc    update payment by id
// @route   /api/category/updatePayment
// @access  Protected
exports.updatePaymentController = asyncHandler(async (req, res) => {
  // Validate req data
  const { error } = paymentValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  if (!req.query.id) {
    return res.status(400).json({ message: PAYMENT_ID_NOT_FOUND });
  }

  // Destructring
  const { client, date, payment_type, amount, note } = req.body;

  const payment = await PaymentModel.findById(req.query.id).exec();

  if (!payment) {
    return res.status(400).json({ message: PAYMENT_NOT_FOUND });
  }

  // Updating
  payment.updated_by = req.user._id.toString();
  payment.client = client;
  payment.date = date;
  payment.payment_type = payment_type;
  payment.amount = amount;
  payment.note = note;

  await payment.save();

  res.status(200).json(PAYMENT_UPDATED);
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
    return res.status(400).json({ message: PAYMENT_ID_NOT_FOUND });
  }

  // Get payment by id
  const payment = await PaymentModel.findById(req.query.id);

  await payment.deleteOne();

  res.status(200).json({ message: PAYMENT_DELETED });
});
