const get = `
    SELECT
        id,
        name,
        address
    FROM users
`;

const getById = `
    SELECT
        id,
        name,
        address
    FROM users
    WHERE id = $1
`;

const checkNameExists = `
    SELECT
        id,
        name,
        address
    FROM users
    WHERE name = $1
`;

const add = `
    INSERT INTO users
    (name, address)
    VALUES ($1, $2)
`;

const remove = `
    DELETE FROM users
    WHERE id = $1
`;

const update = `
    UPDATE users
    SET
        name = $1,
        address = $2
    WHERE id = $3
`;

module.exports = {
    get,
    getById,
    checkNameExists,
    add,
    remove,
    update,
};