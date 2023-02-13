const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  verifyUserController,
  getUserController,
  updateUserController,
  getAllUsersController,
} = require("../controllers/user.controller");
const authHandler = require("../middlewares/token.middleware");
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

// Get all users
router.get("/getAllUsers", authHandler, getAllUsersController);

// Update user
router.patch(
  "/update",
  authHandler,
  uploadUserImage.single("avatar"),
  updateUserController
);

module.exports = router;
