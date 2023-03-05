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
  CLIENTS_ID_REQ,
  CLIENTS_DELETED,
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

  let buffer = "";
  if (req.body.company_logo !== "") {
    buffer = Buffer.from(req.body.company_logo, "base64");
  }

  // Add new client
  const newClient = await new ClientModel({
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString(),
    company_logo: buffer,
    ...req.body,
  });

  newClient.save();
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

  // Get clients
  const clients = await ClientModel.find({
    $or: [
      { company_name: { $regex: new RegExp(search, "i") } },
      { representative_name: { $regex: new RegExp(search, "i") } },
      { role: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
    ],
  })
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize)
    .exec()
    .catch((err) => {
      return res.status(400).json({ message: CLIENTS_NOT_FOUND });
    });
  res.status(200).json(clients);
});

// @desc    update client controller
// @route   /api/clients/updateClient
// @access  Protected

exports.updateClientController = asyncHandler(async (req, res) => {
  // Validate req body
  const { error } = clientValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id and if it exists
  if (!req.query.id) {
    return res.status(400).json({ message: CLIENT_ID_REQ });
  }

  const client = await ClientModel.findById(req.query.id);

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

  //Processing request body

  let buffer = Buffer.from(req.body.company_logo, "base64");

  // Updating

  await ClientModel.findByIdAndUpdate(req.query.id, {
    company_logo: buffer,
    updated_by: req.user._id.toString(),
    ...req.body,
  });

  res.status(200).json({
    message: `${CLIENT_UPDATED}`,
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

// @desc    remove multiple clients by id controller
// @route   /api/clients/removeMultipleClients
// @access  Protected

exports.removeMultipleClientsByIdsController = asyncHandler(
  async (req, res) => {
    // Validate user
    const validUser = _validateUser(req, UserModel);
    if (!validUser) {
      return res.status(401).json({ message: UNAUTHORIZED_ERR });
    }

    // checking for req body
    if (!req.body.ids || req.body.ids.length === 0) {
      return res.status(400).json({ message: CLIENTS_ID_REQ });
    }

    // Get client by id and delete
    await ClientModel.deleteMany({
      _id: {
        $in: [...req.body.ids],
      },
    })
      .exec()
      .catch((err) => {
        return res.status(400).json({ message: CLIENT_NOT_FOUND });
      });

    res.status(200).json({ message: CLIENTS_DELETED });
  }
);
