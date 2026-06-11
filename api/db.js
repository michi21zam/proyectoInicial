// Configuración de la conexión a PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'WenDani808402$$',
  port: 5433
});

module.exports = pool;