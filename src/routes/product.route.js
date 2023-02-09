const router = require("express").Router();
const { addProductController } = require("../controllers/product.controllers");
const authHandler = require("../middlewares/auth.middleware");
const { uploadProductImage } = require("../middlewares/fileUpload.middleware");

//  Add product
router.post(
  "/addProduct",
  authHandler,
  uploadProductImage.array("images"),
  addProductController
);

module.exports = router;
