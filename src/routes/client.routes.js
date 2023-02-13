const {
  addClientController,
  getClientByIdController,
  getAllClientsByIdController,
  updateClientController,
} = require("../controllers/client.controller");
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

// Get client by id
router.get("/getClientById", authHandler, getClientByIdController);

// Get all clients
router.get("/getAllClients", authHandler, getAllClientsByIdController);

// update client
router.patch(
  "/updateClient",
  uploadCompanyImage.single("company_logo"),
  authHandler,
  updateClientController
);

module.exports = router;
