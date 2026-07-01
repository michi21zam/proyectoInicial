const db = require("../../app_db");

// SELECT
const get = async () => {
    const result = await db.raw("SELECT * FROM fn_get_invoices()");
    return result.rows;
};

const getById = async (id) => {
    const result = await db.raw("SELECT * FROM fn_get_invoice_by_id(?)", [id]);
    return result.rows;þ
};

// INSERT (returns the new id)
const add = async (user_id, amount, date, description) => {
    const result = await db.raw(
        "SELECT fn_add_invoice(?, ?, ?, ?) AS id",
        [user_id, amount, date, description]
    );
    return result.rows[0];
};

// DELETE / UPDATE
const remove = (id) => db.raw("CALL sp_remove_invoice(?)", [id]);

const update = (id, user_id, amount, date, description) =>
    db.raw(
        "CALL sp_update_invoice(?, ?, ?, ?, ?)",
        [id, user_id, amount, date, description]
    );

module.exports = {
    get,
    getById,
    add,
    remove,
    update,
};