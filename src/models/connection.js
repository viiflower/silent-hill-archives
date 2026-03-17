
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER,             //usuario
    host: process.env.DB_HOST,           //servidor local
    database: process.env.DB_NAME,     //nombre de la base de datos
    password: process.env.PASSWORD,     //contraseña
    port: process.env.DB_PORT,                 
});

module.exports = pool;