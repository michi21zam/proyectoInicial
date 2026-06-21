const db = require("../../app_db");

const get = () => db('users').select('id', 'name', 'address');

const getById = (id) => db('users').select('id', 'name', 'address').where({ id });

const checkNameExists = (name) => db('users').select('id', 'name', 'address').where({ name });

const add = (name, address) => db('users').insert({ name, address });

const remove = (id) => db('users').where({ id }).del();

const update = (id, name, address) => db('users').where({ id }).update({ name, address });

module.exports = {
    get,
    getById,
    checkNameExists,
    add,
    remove,
    update,
};