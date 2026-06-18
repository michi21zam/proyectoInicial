const { Router } = require("express");
const controller = require("../controllers/invoiceController");

const router = Router();

router.get("/", controller.getInvoices);
router.get("/:id", controller.getInvoiceById);
router.post("/", controller.createInvoice);
router.put("/:id", controller.updateInvoice);
router.delete("/:id", controller.deleteInvoice);

module.exports = router;