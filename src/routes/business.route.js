const router = require("express").Router();
const {
  addDetailController,
  getDetailsByUser,
} = require("../controllers/business.controller");
const authHandler = require("../middlewares/auth.middleware");

//  Added business details
router.post("/addDetails", authHandler, addDetailController);

// Get business details by user
router.get("/getDetailsByUser", authHandler, getDetailsByUser);

module.exports = router;
