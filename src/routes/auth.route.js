const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  verifyUserController,
  getUserController,
} = require("../controllers/user.controller");
const authHandler = require("../middlewares/auth.middleware");
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

// Get user by emp_id
router.get("/getuser", authHandler, getUserController);
module.exports = router;
