const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// CORS - IMPORTANTE: Verifica que esta URL sea la que usas en el navegador
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

// --- RUTA DE LOGIN (La que faltaba) ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userUpper = username.toUpperCase().trim();
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [userUpper]);
    
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password_hash || result.rows[0].password);
      if (match) {
        return res.status(200).json({ message: "acceso_ok", user: userUpper });
      }
    }
    res.status(401).json({ error: "credenciales_invalidas" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error_servidor" });
  }
});

// --- RUTAS DE PERSONAJES ---
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY char_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'error_db' }); }
});

app.post('/api/characters', async (req, res) => {
  const { name, status, image, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO characters (name, status, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase(), status.toUpperCase(), image, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: 'error_save' }); }
});

// --- RUTAS DE MONSTRUOS (Sincronizado con tu pgAdmin) ---
app.get('/api/monsters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monsters ORDER BY monster_id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: 'error_db' }); }
});

app.post('/api/monsters', async (req, res) => {
  const { name, danger, image, description } = req.body;
  try {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Servidor activo en puerto ${PORT}`); });