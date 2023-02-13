const ClientModel = require("../models/client.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const { clientValidation } = require("../validations/client.validations");
const { uploadFileToS3 } = require("../configs/aws.s3");
const { randomBytesGenerator } = require("../utility/randomCryptoGenerator");
const {
  CLIENT_EMAIL_EXISTS,
  CLIENT_ACC_NUM_EXISTS,
  CLIENT_CREATED,
  CLIENT_ID_REQ,
  CLIENT_NOT_FOUND,
  CLIENTS_NOT_FOUND,
  CLIENT_UPDATED,
  CLIENT_DELETED,
} = require("../constants/response.message");

// @desc    add new client controller
// @route   /api/clients/addClient
// @access  Protected
exports.addClientController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }
  // Validate
  const { error } = clientValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check for unique bank account number
  const foundEmail = await ClientModel.findOne({
    email: req.body.email,
  });
  if (foundEmail) {
    return res.status(400).json({ message: CLIENT_EMAIL_EXISTS });
  }

  // Check for unique bank account number
  const foundAccountNum = await ClientModel.findOne({
    bank_account_number: req.body.bank_account_number,
  });
  if (foundAccountNum) {
    return res.status(400).json({ message: CLIENT_ACC_NUM_EXISTS });
  }

  //Process image
  const imageFile = req.file;
  let imageFileName = "";
  if (imageFile) {
    imageFileName = randomBytesGenerator(16);
  }

  // Add new client
  const newClient = await new ClientModel({
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString(),
    company_logo: imageFileName,
    ...req.body,
  });

  newClient.save();
  if (imageFile) {
    await uploadFileToS3(imageFile, imageFileName);
  }
  res.status(200).json({
    message: CLIENT_CREATED,
  });
});

// @desc    get client controller by id
// @route   /api/clients/getClientById
// @access  Protected

exports.getClientByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: CLIENT_ID_REQ });
  }

  // Get client
  const client = await ClientModel.findById(req.query.id).catch((err) => {
    return res.status(400).json({ message: CLIENT_NOT_FOUND });
  });
  res.status(200).json(client);
});

// @desc    get all clients controller
// @route   /api/clients/getClientById
// @access  Protected

exports.getAllClientsByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get clients
  const clients = await ClientModel.find().catch((err) => {
    return res.status(400).json({ message: CLIENTS_NOT_FOUND });
  });
  res.status(200).json(clients);
});

// @desc    update client controller
// @route   /api/clients/updateClient
// @access  Protected

exports.updateClientController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id and if it exists
  if (!req.query.id) {
    return res.status(400).json({ message: CLIENT_ID_REQ });
  }

  const client = await ClientModel.findById(req.query.id).exec();

  if (!client) {
    return res.status(400).json({ message: CLIENT_NOT_FOUND });
  }

  // Check for unique bank account number
  const foundEmail = await ClientModel.findOne({
    email: req.body.email,
  });
  if (foundEmail && foundEmail._id.toString() !== req.query.id) {
    return res.status(400).json({ message: CLIENT_EMAIL_EXISTS });
  }

  // Check for unique bank account number
  const foundAccountNum = await ClientModel.findOne({
    bank_account_number: req.body.bank_account_number,
  });
  if (foundAccountNum && foundAccountNum._id.toString() !== req.query.id) {
    return res.status(400).json({ message: CLIENT_ACC_NUM_EXISTS });
  }

  //Process image
  const imageFile = req.file;
  let imageFileName = "";
  if (imageFile) {
    imageFileName = randomBytesGenerator(16);
  }

  if (imageFile) {
    client.company_logo = imageFileName;
    await uploadFileToS3(imageFile, imageFileName);
  }

  const updatedClient = await client.save();

  res.status(200).json({
    message: `${updatedClient.company_name}'s ${CLIENT_UPDATED}`,
  });
});

// @desc    remove client by id controller
// @route   /api/clients/removeClient
// @access  Protected

exports.removeClientByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: CLIENT_ID_REQ });
  }

  // Get client by id and delete
  const client = await ClientModel.findById(req.query.id).exec();

  if (!client) {
    return res.status(400).json({ message: CLIENT_NOT_FOUND });
  }

  const result = await client.deleteOne();

  res.status(200).json({ message: `${result.company_name} ${CLIENT_DELETED}` });
});
