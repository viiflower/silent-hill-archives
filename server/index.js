const express = require('express');
require('dotenv').config(); 
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors({
  origin: '*',
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

app.get('/', (req, res) => {
  res.send("SERVIDOR DE SILENT HILL ACTIVO");
});

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const upperUser = username.toUpperCase();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [upperUser, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear el expediente." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const upperUser = username.toUpperCase(); 
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [upperUser]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.status(200).json({ message: "ACCESO_CONCEDIDO", user: user.username });
      }
    }
    res.status(401).json({ error: "IDENTIDAD NO RECONOCIDA" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/characters", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM characters ORDER BY char_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/characters", async (req, res) => {
  const { name, status, description, image } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO characters (name, status, description, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, status, description, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/monsters", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM monsters ORDER BY monster_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
});