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
    category: req.body.category.toString(),
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

  // Get products
  const products = await Product.find({
    $or: [
      { name: { $regex: new RegExp(search, "i") } },
      // { amount: { $regex: new RegExp(search, "i") } },
      // { quantity: { $regex: new RegExp(search, "i") } },
      // { totalQty: { $regex: new RegExp(search, "i") } },
      { stock_status: { $regex: new RegExp(search, "i") } },
    ],
  })
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize)
    .populate({
      path: "category",
      select: ["-created_at", "-updated_at"],
    })
    .exec()
    .catch((e) => {
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

  const product = await Product.findById(req.query.id).exec();

  // Check for product exists
  if (!product) {
    return res.status(400).json({ message: NO_PRODUCT_FOUND_ID });
  }

  // Create image data and upload to s3
  const reqFiles = req.files;

  // Checking for limits
  if (reqFiles.length > 0) {
    if (reqFiles.length > 4) {
      return res(400).json({ message: PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED });
    }

    // Separating data for db and S3
    const imageFiles = [];
    for (let i = 0; i < reqFiles.length; i++) {
      let filename = `${req.body.name.replaceAll(" ", "_")}_${Date.now()}`;
      imageFiles.push({
        filename: filename,
        user: req.user._id.toString(),
      });
      await uploadFileToS3(reqFiles[i], filename);
    }
  }
  const updatedProduct = await product.save();
  res
    .status(200)
    .json({ message: `${updatedProduct.name} ${UPDATED_PRODUCT_DETAILS}` });
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
  const product = await Product.findById(req.query.id);

  // Check for product exists
  if (!product) {
    return res.status(400).json({ message: NO_PRODUCT_FOUND_ID });
  }
  const result = await product.deleteOne();
  res.status(200).json({ message: `${result.name} ${REMOVED_PRODUCT}` });
});

module.exports = {
  addProductController,
  getAllProductsController,
  getProductByIdController,
  getProductsByCatController,
  updateProductByIdController,
  deleteProductByIdController,
};
