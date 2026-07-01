const db = require("../../app_db");

// SELECT
const get = async () => {
    const result = await db.raw("SELECT * FROM fn_get_users()");
    return result.rows;
};

const getById = async (id) => {
    const result = await db.raw("SELECT * FROM fn_get_user_by_id(?)", [id]);
    return result.rows;
};

const checkNameExists = async (name) => {
    const result = await db.raw("SELECT * FROM fn_check_user_name_exists(?)", [name]);
    return result.rows;
};

// INSERT (returns the new id)
const add = async (name, address) => {
    const result = await db.raw("SELECT fn_add_user(?, ?) AS id", [name, address]);
    return result.rows[0];
};

// DELETE / UPDATE
const remove = (id) => db.raw("CALL sp_remove_user(?)", [id]);

const update = (id, name, address) =>
    db.raw("CALL sp_update_user(?, ?, ?)", [id, name, address]);

module.exports = {
    get,
    getById,
    checkNameExists,
    add,
    remove,
    update,
};