const {
  addPaymentController,
  getAllPaymentsController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentByIdController,
} = require("../controllers/payment.controller");
const authHandler = require("../middlewares/token.middleware");
const router = require("express").Router();

// Add payment endpoint
router.post("/addPayment", authHandler, addPaymentController);

// Get all payments endpoint
router.get("/getAllPayments", authHandler, getAllPaymentsController);

// Get payment by id endpoint
router.get("/getPaymentById", authHandler, getPaymentByIdController);

// Update payment by id endpoint
router.patch("/updatePayment", authHandler, updatePaymentController);

// Delete payment by id endpoint
router.delete("/deletePayment", authHandler, deletePaymentByIdController);

module.exports = router;
