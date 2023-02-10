const router = require("express").Router();
const {
  addProductController,
  getAllProductsController,
  getProductByIdController,
  getProductsByCatController,
  updateProductByIdController,
  deleteProductByIdController,
} = require("../controllers/product.controllers");
const authHandler = require("../middlewares/token.middleware");
const { uploadProductImage } = require("../middlewares/fileUpload.middleware");

//  Add product
router.post(
  "/addProduct",
  authHandler,
  uploadProductImage.array("images"),
  addProductController
);

//  Get all products
router.get("/getAllProducts", authHandler, getAllProductsController);

//  Get product by id
router.get("/getProductById", authHandler, getProductByIdController);

//  Get product by category
router.get("/getProductsByCategory", authHandler, getProductsByCatController);

// Update product by Id
router.put(
  "/updateProductById",
  authHandler,
  uploadProductImage.array("images"),
  updateProductByIdController
);

// Delete product by Id
router.delete("/deleteProductById", authHandler, deleteProductByIdController);

module.exports = router;
