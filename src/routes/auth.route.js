const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  uploadImage,
} = require("../controllers/user.controller");

//User Register Endpoint
router.post("/register", uploadImage.single("avatar"), registerUserController);

// User Signin Endpoint
router.post("/signin", signinUserController);

module.exports = router;
