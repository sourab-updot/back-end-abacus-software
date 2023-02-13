const { addClientController } = require("../controllers/client.controller");
const { uploadCompanyImage } = require("../middlewares/fileUpload.middleware");
const authHandler = require("../middlewares/token.middleware");
const router = require("express").Router();

// Add a new client
router.post(
  "/addClient",
  authHandler,
  uploadCompanyImage.single("company_logo"),
  addClientController
);

module.exports = router;
