const pool = require("../../app_db");
const queries = require("../queries/invoiceQueries");

const getInvoices = (req, res) => {
    pool.query(queries.get, (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
};

const createInvoice = (req, res) => {
    const { user_id, amount, date, description } = req.body;

    pool.query(
        queries.add,
        [user_id, amount, date, description],
        (error, results) => {
            if (error) throw error;

            res.status(201).json({
                message: "Invoice created successfully"
            });
        }
    );
};

const getInvoiceById = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        res.status(200).json(results.rows);
    });
};

const deleteInvoice = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        const notFound = !results.rows.length;

        if (notFound) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        pool.query(queries.remove, [id], (error, results) => {
            if (error) throw error;

            res.status(200).json({
                message: "Invoice deleted successfully"
            });
        });
    });
};

const updateInvoice = (req, res) => {
    const id = parseInt(req.params.id);

    const {
        user_id,
        amount,
        date,
        description
    } = req.body;

    pool.query(queries.getById, [id], (error, results) => {
        if (error) throw error;

        const notFound = !results.rows.length;

        if (notFound) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        pool.query(
            queries.update,
            [user_id, amount, date, description, id],
            (error, results) => {
                if (error) throw error;

                res.status(200).json({
                    message: "Invoice updated successfully"
                });
            }
        );
    });
};

module.exports = {
    getInvoices,
    getInvoiceById,
    createInvoice,
    deleteInvoice,
    updateInvoice
};