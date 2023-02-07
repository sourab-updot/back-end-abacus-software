const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
} = require("../controllers/user.controller");

//User Register Endpoint
router.post("/register", registerUserController);

// User Signin Endpoint
router.post("/signin", signinUserController);

module.exports = router;
