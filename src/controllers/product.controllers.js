const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { productValidation } = require("../validations/product.validation");
const {
  PRODUCT_CREATED,
  UNAUTHORIZED_ERR,
  USERNAME_NOT_FOUND_ERR,
  PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED,
} = require("../constants/response.message");
const { uploadFileToS3 } = require("../configs/aws.s3");

// @desc    add products
// @route   /api/products/addProduct
// @access  Protected
const addProductController = asyncHandler(async (req, res) => {
  // Validate
  const { error } = productValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Check for authorized user
  if (!req.user) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }
  //  Check if user exists in db
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    return res.status(400).json({ message: USERNAME_NOT_FOUND_ERR });
  }

  // Create image data and upload to s3
  const reqFiles = req.files;
  if (reqFiles.length > 4) {
    return res(400).json({ message: PRODUCT_IMAGES_COUNT_LIMIT_EXCEEDED });
  }
  const imageFiles = [];
  if (reqFiles.length > 0) {
    for (let i = 0; i < reqFiles.length; i++) {
      let filename = `${req.body.name}_${Date.now()}`;
      imageFiles.push({
        filename: filename,
        user: user._id.toString(),
      });
      await uploadFileToS3(reqFiles[i], filename);
    }
  }
  // Create product

  const newProduct = new Product({
    created_by: user._id.toString(),
    updated_by: user._id.toString(),
    images: imageFiles,
    // This is temprorary category
    category: "63e4b611e8c84af2bb8ae0ba",
    ...req.body,
  });
  await newProduct.save();
  res.status(200).json({ message: PRODUCT_CREATED });
});

module.exports = {
  addProductController,
};
