const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { productValidation } = require("../validations/product.validation");
const {
  PRODUCT_CREATED,
  UNAUTHORIZED_ERR,
  PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED,
  NO_PRODUCTS_FOUND,
  NO_PRODUCT_FOUND_ID,
  NO_PRODUCTS_FOUND_CAT,
  UPDATED_PRODUCT_DETAILS,
  REMOVED_PRODUCT,
  PRODUCT_ID_REQUIRED,
  PRODUCT_CAT_REQUIRED,
} = require("../constants/response.message");
const { uploadFileToS3 } = require("../configs/aws.s3");
const { _validateUser } = require("../middlewares/_validate.middleware");

// @desc    add products
// @route   /api/products/addProduct
// @access  Protected
const addProductController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = productValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Create image data and upload to s3
  const reqFiles = req.files;

  // Checking for limits
  if (reqFiles.length > 4) {
    return res(400).json({ message: PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED });
  }

  // Separating data for db and S3
  const imageFiles = [];
  if (reqFiles.length > 0) {
    for (let i = 0; i < reqFiles.length; i++) {
      let filename = `${req.body.name.replaceAll(" ", "_")}_${Date.now()}`;
      imageFiles.push({
        filename: filename,
        user: req.user._id.toString(),
      });
      await uploadFileToS3(reqFiles[i], filename);
    }
  }

  // Create product
  const newProduct = new Product({
    created_by: req.user._id.toString(),
    updated_by: req.user._id.toString(),
    images: imageFiles,
    // This is temprorary category
    category: "63e4b611e8c84af2bb8ae0ba",
    ...req.body,
  });
  await newProduct.save();
  res.status(200).json({ message: PRODUCT_CREATED });
});

// @desc    get products
// @route   /api/products/getAllProducts
// @access  Protected
const getAllProductsController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get products
  const products = await Product.find().catch((e) => {
    return res.status(400).json({ message: NO_PRODUCTS_FOUND });
  });

  res.status(200).json(products);
});

// @desc    get product by id
// @route   /api/products/getProductById
// @access  Protected
const getProductByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: PRODUCT_ID_REQUIRED });
  }

  // Get products
  const product = await Product.findById(req.query.id);

  // Check for product exists
  if (!product) {
    return res.status(400).json({ message: NO_PRODUCT_FOUND_ID });
  }
  res.status(200).json(product);
});

// @desc    get products by category
// @route   /api/products/getProductsByCategory
// @access  Protected
const getProductsByCatController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.category) {
    return res.status(400).json({ message: PRODUCT_CAT_REQUIRED });
  }

  // Get products
  const products = await Product.find({ category: req.query.category });

  // Check for product exists under the category
  if (!products) {
    return res.status(400).json({ message: NO_PRODUCTS_FOUND_CAT });
  }
  res.status(200).json(products);
});

// @desc    update product
// @route   /api/products/updateProductById
// @access  Protected
const updateProductByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: PRODUCT_ID_REQUIRED });
  }

  // Create image data and upload to s3
  const reqFiles = req.files;

  // Checking for limits
  if (reqFiles.length > 4) {
    return res(400).json({ message: PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED });
  }

  // Separating data for db and S3
  const imageFiles = [];
  if (reqFiles.length > 0) {
    for (let i = 0; i < reqFiles.length; i++) {
      let filename = `${req.body.name.replaceAll(" ", "_")}_${Date.now()}`;
      imageFiles.push({
        filename: filename,
        user: req.user._id.toString(),
      });
      await uploadFileToS3(reqFiles[i], filename);
    }
  }

  // update product
  const product = await Product.findByIdAndUpdate(req.query.id, {
    updated_by: req.user._id.toString(),
    images: imageFiles,
    ...req.body,
  });

  // Check for product exists
  if (!product) {
    return res.status(400).json({ message: NO_PRODUCT_FOUND_ID });
  }
  res.status(200).json({ message: UPDATED_PRODUCT_DETAILS });
});

// @desc    delete product
// @route   /api/products/deleteProductById
// @access  Protected
const deleteProductByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // checking for params id
  if (!req.query.id) {
    return res.status(400).json({ message: PRODUCT_ID_REQUIRED });
  }

  // delete product
  const product = await Product.findByIdAndDelete(req.query.id);

  // Check for product exists
  if (!product) {
    return res.status(400).json({ message: NO_PRODUCT_FOUND_ID });
  }
  res.status(200).json({ message: REMOVED_PRODUCT });
});

module.exports = {
  addProductController,
  getAllProductsController,
  getProductByIdController,
  getProductsByCatController,
  updateProductByIdController,
  deleteProductByIdController,
};
