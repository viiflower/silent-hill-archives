const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'https://silent-hill-archives-1.onrender.com', // Tu URL de Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => {
  res.send("SERVIDOR DE SILENT HILL ACTIVO");
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "DATOS_INCOMPLETOS" });

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username.toUpperCase().trim()]);
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password);
      if (match) return res.status(200).json({ message: "ACCESO_CONCEDIDO", user: username.toUpperCase() });
    }
    res.status(401).json({ error: "CREDENCIALES_INVALIDAS" });
  } catch (err) {
    res.status(500).json({ error: "ERROR_DE_SISTEMA" });
  }
});

// REGISTRO
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "DATOS_INCOMPLETOS" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username",
      [username.toUpperCase().trim(), hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      return res.status(400).json({ error: "EL_USUARIO_YA_EXISTE" });
    }
    res.status(500).json({ error: "ERROR_AL_REGISTRAR" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVIDOR EN PUERTO ${PORT}`);
});