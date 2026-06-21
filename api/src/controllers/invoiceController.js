const queries = require("../queries/invoiceQueries");

const getInvoices = async (req, res) => {
    try {
        const invoices = await queries.get();
        res.status(200).json(invoices);
    } catch (error) {
        throw error;
    }
};

const createInvoice = async (req, res) => {
    const { user_id, amount, date, description } = req.body;

    try {
        await queries.add(user_id, amount, date, description);
        res.status(201).json({
            message: "Invoice created successfully"
        });
    } catch (error) {
        throw error;
    }
};

const getInvoiceById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const invoice = await queries.getById(id);
        res.status(200).json(invoice);
    } catch (error) {
        throw error;
    }
};

const deleteInvoice = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const existingInvoice = await queries.getById(id);
        const notFound = !existingInvoice.length;

        if (notFound) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        await queries.remove(id);
        res.status(200).json({
            message: "Invoice deleted successfully"
        });
    } catch (error) {
        throw error;
    }
};

const updateInvoice = async (req, res) => {
    const id = parseInt(req.params.id);
    const { user_id, amount, date, description } = req.body;

    try {
        const existingInvoice = await queries.getById(id);
        const notFound = !existingInvoice.length;

        if (notFound) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        await queries.update(id, user_id, amount, date, description);
        res.status(200).json({
            message: "Invoice updated successfully"
        });
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    deleteInvoice,
    updateInvoice
};