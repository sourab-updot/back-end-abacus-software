const router = require("express").Router();
const {
  signinUserController,
  registerUserController,
  verifyUserController,
  getUserController,
  updateUserController,
  getAllUsersController,
  userPasswordResetController,
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

// Updated password only for super admin and not to be used in client side, either used postman or make curl requests
router.patch("/passwordReset", authHandler, userPasswordResetController);

module.exports = router;
