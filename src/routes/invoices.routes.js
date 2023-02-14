const router = require("express").Router();
const authHandler = require("../middlewares/token.middleware");
const {
  addInvoicesController,
  getAllInvoiceController,
  getInvoiceByIdController,
  getInvoiceByUserController,
  deleteInvoiceByIdController,
  updateInvoiceByIdController,
} = require("../controllers/invoices.controllers");
const { uploadAttachments } = require("../middlewares/fileUpload.middleware");

router.post(
  "/addInvoice",
  authHandler,
  uploadAttachments.fields([
    {
      name: "company_logo",
      maxCount: 1,
    },
    {
      name: "attachments",
      maxCount: 3,
    },
  ]),
  addInvoicesController
);

// get all invoices
router.get("/getInvoices", authHandler, getAllInvoiceController);

// get invoice by id
router.get("/getInvoiceById", authHandler, getInvoiceByIdController);

// get invoice by user
router.get("/getInvoiceByUser", authHandler, getInvoiceByUserController);

// delete invoice by user
router.delete("/deleteInvoice", authHandler, deleteInvoiceByIdController);

// update invoice by id
router.patch(
  "/updateInvoice",
  authHandler,
  uploadAttachments.fields([
    {
      name: "company_logo",
      maxCount: 1,
    },
    {
      name: "attachments",
      maxCount: 3,
    },
  ]),
  updateInvoiceByIdController
);

module.exports = router;
