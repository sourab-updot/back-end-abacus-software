const Category = require("../models/category.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { _validateUser } = require("../middlewares/_validate.middleware");
const { UNAUTHORIZED_ERR } = require("../constants/response.message");

// @desc    add category controller
// @route   /api/category/addCategory
// @access  Protected
exports.addCategoryController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  const newCategory = await new Category({
    created_by: req.user._id,
    updated_by: req.user._id,
    ...req.body,
  });

  newCategory.save();
  res.status(200).json({
    message: "Category created successfully.",
  });
});

// @desc    get category by id controller
// @route   /api/category/getCategoryById
// @access  Protected
exports.getCategoryByIdController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get category
  const category = await Category.findById(req.query.id).catch(() =>
    res.status(400).json({ message: "No category found with this ID" })
  );

  res.status(200).json(category);
});

// @desc    get all category controller
// @route   /api/category/getAllCategory
// @access  Protected
exports.getAllCategoryController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get category
  const category = await Category.find().catch(() =>
    res.status(400).json({ message: "No category found." })
  );

  res.status(200).json(category);
});

// @desc    update category by id controller
// @route   /api/category/updateCategory
// @access  Protected
exports.updateCategoryController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get category
  await Category.findByIdAndUpdate(req.query.id, {
    updated_by: req.user._id,
    ...req.body,
  }).catch(() =>
    res.status(400).json({ message: "No category found with this ID." })
  );

  res.status(200).json({ message: "Category updated successfully." });
});

// @desc    delete category by id controller
// @route   /api/category/deleteCategory
// @access  Protected
exports.deleteCategoryController = asyncHandler(async (req, res) => {
  // Validate user
  const validUser = _validateUser(req, User);
  if (!validUser) {
    return res.status(401).json({ message: UNAUTHORIZED_ERR });
  }

  // Get category
  await Category.findByIdAndDelete(req.query.id).catch(() =>
    res.status(400).json({ message: "No category found with this ID." })
  );

  res.status(200).json({ message: "Category deleted successfully." });
});
