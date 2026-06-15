// Configuración de la conexión a PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'usuarios',
  password: 'root123',
  port: 5432
});

module.exports = pool;