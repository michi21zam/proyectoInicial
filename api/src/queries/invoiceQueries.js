const db = require("../../app_db");

const get = () =>
    db('invoices as i')
        .join('users as u', 'i.user_id', 'u.id')
        .select(
            'i.id',
            'i.user_id',
            'u.name as user_name',
            'i.amount',
            'i.date',
            'i.description'
        )
        .orderBy('i.id');

const getById = (id) =>
    db('invoices as i')
        .join('users as u', 'i.user_id', 'u.id')
        .select(
            'i.id',
            'i.user_id',
            'u.name as user_name',
            'i.amount',
            'i.date',
            'i.description'
        )
        .where('i.id', id);

const add = (user_id, amount, date, description) =>
    db('invoices').insert({ user_id, amount, date, description });

const remove = (id) => db('invoices').where({ id }).del();

const update = (id, user_id, amount, date, description) =>
    db('invoices')
        .where({ id })
        .update({ user_id, amount, date, description });

module.exports = {
    get,
    getById,
    add,
    remove,
    update,
};