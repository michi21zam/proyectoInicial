// PostgreSQL connection configuration, using Knex as the query builder.
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        user: 'postgres',
        host: 'localhost',
        database: 'app_db',
        password: 'root123',
        port: 5432
    }
});

module.exports = db;