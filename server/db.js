const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'silent_hill_archives',
  password: 'Contraseña123', 
  port: 5432,
});

module.exports = pool;