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

// login y registro
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userUpper = username.toUpperCase().trim();
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [userUpper]);
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password);
      if (match) return res.status(200).json({ message: "ACCESO_OK", user: userUpper });
    }
    res.status(401).json({ error: "CREDENCIALES_INVALIDAS" });
  } catch (err) {
    res.status(500).json({ error: "ERROR_INTERNO" });
  }
});

// rutas personajes
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY char_id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'error_leer_db' });
  }
});

app.post('/api/characters', async (req, res) => {
  const { name, status, image, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO characters (name, status, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase().trim(), status.toUpperCase().trim(), image, description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error_guardar' });
  }
});

// editar personaje
app.put('/api/characters/:id', async (req, res) => {
  const { name, status, image, description } = req.body;
  try {
    await pool.query(
      'UPDATE characters SET name=$1, status=$2, image=$3, description=$4 WHERE char_id=$5',
      [name.toUpperCase(), status.toUpperCase(), image, description, req.params.id]
    );
    res.json({ message: "actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// eliminar personaje
app.delete('/api/characters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM characters WHERE char_id = $1', [req.params.id]);
    res.json({ message: "eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// rutas monstruos
app.get('/api/monsters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monsters ORDER BY monster_id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'error_leer_db' });
  }
});

app.post('/api/monsters', async (req, res) => {
  const { name, danger, image, description, encounter_location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO monsters (name, danger, image, description, encounter_location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name.toUpperCase().trim(), danger.toUpperCase().trim(), image, description.trim(), encounter_location || "UNKNOWN"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'error_guardar' });
  }
});

// editar monstruo
app.put('/api/monsters/:id', async (req, res) => {
  const { name, danger, image, description } = req.body;
  try {
    await pool.query(
      'UPDATE monsters SET name=$1, danger=$2, image=$3, description=$4 WHERE monster_id=$5',
      [name.toUpperCase(), danger.toUpperCase(), image, description, req.params.id]
    );
    res.json({ message: "actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// eliminar monstruo
app.delete('/api/monsters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM monsters WHERE monster_id = $1', [req.params.id]);
    res.json({ message: "eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`servidor en puerto ${PORT}`);
});