const {
  addClientController,
  getClientByIdController,
  getAllClientsByIdController,
  updateClientController,
  removeClientByIdController,
  removeMultipleClientsByIdsController,
} = require("../controllers/client.controller");
const authHandler = require("../middlewares/token.middleware");
const router = require("express").Router();

// Add a new client
router.post("/addClient", authHandler, addClientController);

// Get client by id
router.get("/getClientById", authHandler, getClientByIdController);

// Get all clients
router.get("/getAllClients", authHandler, getAllClientsByIdController);

// update client
router.patch("/updateClient", authHandler, updateClientController);

//  remove a singel client
router.delete("/removeClient", authHandler, removeClientByIdController);

// remove multiple clients
router.delete(
  "/removeMultipleClients",
  authHandler,
  removeMultipleClientsByIdsController
);

module.exports = router;
