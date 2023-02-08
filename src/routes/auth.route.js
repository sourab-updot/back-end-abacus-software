const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  verifyUserController,
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

module.exports = router;
