const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
} = require("../controllers/user.controller");
const { uploadUserImage } = require("../middlewares/fileUpload.middleware");

//User Register Endpoint
router.post(
  "/register",
  uploadUserImage.single("avatar"),
  registerUserController
);

// User Signin Endpoint
router.post("/signin", signinUserController);

module.exports = router;
