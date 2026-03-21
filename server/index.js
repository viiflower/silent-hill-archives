const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

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

// --- MONSTERS ---
app.get('/api/monsters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monsters ORDER BY monster_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'db_error' }); }
});

app.post('/api/monsters', async (req, res) => {
  const { name, danger, image, description } = req.body;
  try {
    // Usamos exactamente lo que vimos en tu pgAdmin
    const result = await pool.query(
      'INSERT INTO monsters (name, danger, description, image) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase(), danger.toUpperCase(), description, image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error_save', detail: err.message });
  }
});

app.delete('/api/monsters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM monsters WHERE monster_id = $1', [req.params.id]);
    res.json({ message: "ok" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- CHARACTERS ---
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY char_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'db_error' }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Puerto ${PORT}`); });