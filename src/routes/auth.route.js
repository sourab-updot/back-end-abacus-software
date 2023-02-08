const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  verifyUserController,
  verifyTokenController,
} = require("../controllers/user.controller");
const { uploadUserImage } = require("../middlewares/fileUpload.middleware");

//User Register Endpoint
router.post(
  "/register",
  uploadUserImage.single("avatar"),
  registerUserController
);

// User signin endpoint
router.post("/signin", signinUserController);

// User verification endpoint
router.post("/verify", verifyUserController);

// Verify user token
router.post("/token", verifyTokenController);

module.exports = router;
