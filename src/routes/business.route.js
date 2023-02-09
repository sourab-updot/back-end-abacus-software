const router = require("express").Router();
const {
  addDetailController,
  getDetailsByUserController,
  updateDetailsByUserController,
  deleteDetailsByUserController,
} = require("../controllers/business.controller");
const authHandler = require("../middlewares/auth.middleware");

//  Added business details
router.post("/addDetails", authHandler, addDetailController);

// Get business details by user
router.get("/getDetailsByUser", authHandler, getDetailsByUserController);

// Update business details by user
router.post("/updateDetailsByUser", authHandler, updateDetailsByUserController);

// Update business details by user
router.delete(
  "/deleteDetailsByUser",
  authHandler,
  deleteDetailsByUserController
);

module.exports = router;
