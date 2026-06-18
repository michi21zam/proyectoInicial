const get = `
    SELECT
        i.id,
        i.user_id,
        u.name AS user_name,
        i.amount,
        i.date,
        i.description
    FROM invoices i
    JOIN users u ON i.user_id = u.id
    ORDER BY i.id
`;

const getById = `
    SELECT
        i.id,
        i.user_id,
        u.name AS user_name,
        i.amount,
        i.date,
        i.description
    FROM invoices i
    JOIN users u ON i.user_id = u.id
    WHERE i.id = $1
`;

const add = `
    INSERT INTO invoices
    (user_id, amount, date, description)
    VALUES ($1, $2, $3, $4)
`;

const remove = `
    DELETE FROM invoices
    WHERE id = $1
`;

const update = `
    UPDATE invoices
    SET
        user_id = $1,
        amount = $2,
        date = $3,
        description = $4
    WHERE id = $5
`;

module.exports = {
    get,
    getById,
    add,
    remove,
    update,
};