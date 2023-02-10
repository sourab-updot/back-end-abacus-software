const {
  addCategoryController,
  getCategoryByIdController,
  getAllCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category.controller");
const authHandler = require("../middlewares/token.middleware");

const router = require("express").Router();

//  Add category
router.post("/addCategory", authHandler, addCategoryController);

// Get category by Id
router.get("/getCategoryById", authHandler, getCategoryByIdController);

// Get all category
router.get("/getAllCategory", authHandler, getAllCategoryController);

// Update category
router.patch("/updateCategory", authHandler, updateCategoryController);

// Delete category
router.delete("/deleteCategory", authHandler, deleteCategoryController);

module.exports = router;
