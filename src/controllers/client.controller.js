const ClientModel = require("../models/client.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const { clientValidation } = require("../validations/client.validations");
const { uploadFileToS3 } = require("../configs/aws.s3");
const { randomBytesGenerator } = require("../utility/randomCryptoGenerator");

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
    return res
      .status(400)
      .json({ message: "Client already exists with this email address." });
  }

  // Check for unique bank account number
  const foundAccountNum = await ClientModel.findOne({
    bank_account_number: req.body.bank_account_number,
  });
  if (foundAccountNum) {
    return res
      .status(400)
      .json({ message: "Client already exists with this bank details" });
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
    message: "Client added successfully",
  });
});
