const InvoiceModel = require("../models/invoice.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const { invoiceValidation } = require("../validations/invoice.validations");
const { uploadFileToS3 } = require("../configs/aws.s3");
const { randomBytesGenerator } = require("../utility/randomCryptoGenerator");
const { UNAUTHORIZED_ERR } = require("../constants/response.message");

// @desc    add invoice controller
// @route   /api/invoices/addInvoice
// @access  Protected
exports.addInvoicesController = asyncHandler(async (req, res) => {
  // Validate req data
  const { error } = invoiceValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Destructoring req body
  const {
    issued_by_company_name,
    issued_by_mobile_number,
    issued_by_address_line_one,
    issued_by_address_line_two,
    issued_by_city,
    issued_by_state,
    issued_by_pincode,
    issued_by_country,
    billed_to_company_name,
    billed_to_mobile_number,
    billed_to_address_line_one,
    billed_to_address_line_two,
    billed_to_city,
    billed_to_state,
    billed_to_pincode,
    billed_to_country,
    invoice_number,
    issue_date,
    due_date,
    amount_due,
    status,
    notes,
    custom_info,
    invoice,
    total_amount,
    additional_charges,
    vat,
    discount,
    payable,
    bank_name,
    bank_account_number,
    bank_ifsc_code,
    terms,
    payment_terms,
  } = req.body;

  //Process image
  const imageFile = req.files["company_logo"];
  if (!imageFile) {
    return res.status(400).json({ message: "Company image is required" });
  }
  const imageFileName = randomBytesGenerator(16);

  // Process attachments
  const attachedFiles = req.files["attachments"];
  const attachments = [];
  if (attachedFiles.length > 0) {
    for (let i = 0; i < attachedFiles.length; i++) {
      let filename = `${invoice_number}_${Date.now() + i}`;
      attachments.push({
        filename: filename,
        user: req.user._id.toString(),
      });
      await uploadFileToS3(attachedFiles[i], filename);
    }
  }

  // Creating new invoice
  const newInvoice = await new InvoiceModel({
    created_by: req.user._id,
    updated_by: req.user._id,
    company_logo: imageFileName,
    issued_by_company_name,
    issued_by_mobile_number,
    issued_by_address_line_one,
    issued_by_address_line_two,
    issued_by_city,
    issued_by_state,
    issued_by_pincode,
    issued_by_country,
    billed_to_company_name,
    billed_to_mobile_number,
    billed_to_address_line_one,
    billed_to_address_line_two,
    billed_to_city,
    billed_to_state,
    billed_to_pincode,
    billed_to_country,
    invoice_number,
    issue_date,
    due_date,
    amount_due,
    status,
    notes,
    custom_info,
    invoice,
    total_amount,
    additional_charges,
    vat,
    discount,
    payable,
    bank_name,
    bank_account_number,
    bank_ifsc_code,
    terms,
    payment_terms,
    attachments,
  });

  newInvoice.save();
  await uploadFileToS3(imageFile, imageFileName);
  res.status(200).json({
    message: "Invoice created successfully",
  });
});

// @desc    get all invoices controller
// @route   /api/invoices/getInvoiceById
// @access  Protected
exports.getAllInvoiceController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const invoice = await InvoiceModel.find().exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  res.status(200).json(invoice);
});

// @desc    get invoice by id controller
// @route   /api/invoices/getInvoiceById
// @access  Protected
exports.getInvoiceByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // check for query id
  if (!req.query.id) {
    return res.status(400).json({ message: "Invoice id is required" });
  }

  const invoice = await InvoiceModel.findById(req.query.id).exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  res.status(200).json(invoice);
});

// @desc    get invoice by user controller
// @route   /api/invoices/getInvoiceById
// @access  Protected
exports.getInvoiceByUserController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // check for query id
  if (!req.query.user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // check user by id
  const user = await UserModel.findById(req.query.user_id).exec();
  if (!user) {
    return res.status(400).json({ message: "User does not exists." });
  }

  const invoice = await InvoiceModel.findOne({
    created_by: req.query.user_id,
  })
    .populate({
      path: "created_by",
      select: [
        "-password",
        "-verification_code",
        "-created_at",
        "-updated_at",
        "-__v",
      ],
    })
    .exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found." });
  }

  res.status(200).json(invoice);
});

// @desc    delete invoice by id controller
// @route   /api/invoices/deleteInvoice
// @access  Protected
exports.deleteInvoiceByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // check for query id
  if (!req.query.id) {
    return res.status(400).json({ message: "Invoice id is required" });
  }

  const invoice = await InvoiceModel.findById(req.query.id).exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  const deletedInvoice = await invoice.deleteOne();
  res.status(200).json({
    message: `Invoice ${deletedInvoice.invoice_number} removed successfully`,
  });
});

// @desc    update invoice by id controller
// @route   /api/invoices/updateInvoice
// @access  Protected
exports.updateInvoiceByIdController = asyncHandler(async (req, res) => {
  // Validate req data
  const { error } = invoiceValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Validate user
  const validUser = _validateUser(req, UserModel);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // check for query id
  if (!req.query.id) {
    return res.status(400).json({ message: "Invoice id is required" });
  }

  // Destructoring req body
  const {
    issued_by_company_name,
    issued_by_mobile_number,
    issued_by_address_line_one,
    issued_by_address_line_two,
    issued_by_city,
    issued_by_state,
    issued_by_pincode,
    issued_by_country,
    billed_to_company_name,
    billed_to_mobile_number,
    billed_to_address_line_one,
    billed_to_address_line_two,
    billed_to_city,
    billed_to_state,
    billed_to_pincode,
    billed_to_country,
    invoice_number,
    issue_date,
    due_date,
    amount_due,
    status,
    notes,
    custom_info,
    invoice,
    total_amount,
    additional_charges,
    vat,
    discount,
    payable,
    bank_name,
    bank_account_number,
    bank_ifsc_code,
    terms,
    payment_terms,
  } = req.body;

  //Get the invoice
  const invoiceData = await InvoiceModel.findById(req.query.id).exec();
  if (!invoice) {
    return res.status(400).json({ message: "Invoice not found" });
  }

  //Process image
  const imageFile = req.files["company_logo"];
  let imageFileName = "";
  if (imageFile) {
    imageFileName = randomBytesGenerator(16);
    invoiceData.company_logo = imageFileName;
    await uploadFileToS3(imageFile, imageFileName);
  }

  // Process attachments
  const attachedFiles = req.files["attachments"];
  const attachments = [];
  if (attachedFiles.length > 0) {
    for (let i = 0; i < attachedFiles.length; i++) {
      let filename = `${invoice_number}_${Date.now() + i}`;
      attachments.push({
        filename: filename,
        user: req.user._id.toString(),
      });
      invoiceData.attachments = attachments;
      await uploadFileToS3(attachedFiles[i], filename);
    }
  }

  (invoiceData.updated_by = req.user._id.toString()),
    (invoiceData.issued_by_company_name = issued_by_company_name);
  invoiceData.issued_by_mobile_number = issued_by_mobile_number;
  invoiceData.issued_by_address_line_one = issued_by_address_line_one;
  invoiceData.issued_by_address_line_two = issued_by_address_line_two;
  invoiceData.issued_by_city = issued_by_city;
  invoiceData.issued_by_state = issued_by_state;
  invoiceData.issued_by_pincode = issued_by_pincode;
  invoiceData.issued_by_country = issued_by_country;
  invoiceData.billed_to_company_name = billed_to_company_name;
  invoiceData.billed_to_mobile_number = billed_to_mobile_number;
  invoiceData.billed_to_address_line_one = billed_to_address_line_one;
  invoiceData.billed_to_address_line_two = billed_to_address_line_two;
  invoiceData.billed_to_city = billed_to_city;
  invoiceData.billed_to_state = billed_to_state;
  invoiceData.billed_to_pincode = billed_to_pincode;
  invoiceData.billed_to_country = billed_to_country;
  invoiceData.issue_date = issue_date;
  invoiceData.due_date = due_date;
  invoiceData.amount_due = amount_due;
  invoiceData.status = status;
  invoiceData.notes = notes;
  invoiceData.custom_info = custom_info;
  invoiceData.invoice = invoice;
  invoiceData.total_amount = total_amount;
  invoiceData.additional_charges = additional_charges;
  invoiceData.vat = vat;
  invoiceData.discount = discount;
  invoiceData.payable = payable;
  invoiceData.bank_name = bank_name;
  invoiceData.bank_account_number = bank_account_number;
  invoiceData.bank_ifsc_code = bank_ifsc_code;
  invoiceData.terms = terms;
  invoiceData.payment_terms = payment_terms;

  const updatedInvoice = await invoiceData.save();

  res.status(202).json({
    message: `Invoice ${updatedInvoice.invoice_number} updated successfully`,
  });
});
