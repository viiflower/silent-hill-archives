const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Configuración de CORS - Verifica que sea tu URL de Render
app.use(cors({
  origin: 'https://silent-hill-archives-1.onrender.com', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

// --- RUTAS DE PERSONAJES ---
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY char_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'error_db_characters' }); }
});

app.post('/api/characters', async (req, res) => {
  const { name, status, image, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO characters (name, status, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase(), status.toUpperCase(), image, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'error_save_character' }); }
});

// --- RUTAS DE MONSTRUOS (Sincronizadas con tu pgAdmin) ---
app.get('/api/monsters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monsters ORDER BY monster_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'error_db_monsters' }); }
});

app.post('/api/monsters', async (req, res) => {
  const { name, danger, image, description } = req.body;
  try {
    // Solo usamos columnas existentes: name, danger, description, image
    const result = await pool.query(
      'INSERT INTO monsters (name, danger, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase(), danger.toUpperCase(), description, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DEBUG BD:", err.message);
    res.status(500).json({ error: 'error_save_monster', detail: err.message });
  }
});

app.delete('/api/monsters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM monsters WHERE monster_id = $1', [req.params.id]);
    res.json({ message: "eliminado" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Servidor activo en puerto ${PORT}`); });