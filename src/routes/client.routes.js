const {
  addClientController,
  getClientByIdController,
  getAllClientsByIdController,
  updateClientController,
  removeClientByIdController,
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

//  remove client
router.delete("/removeClient", authHandler, removeClientByIdController);

module.exports = router;
