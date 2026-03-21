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

app.get('/', (req, res) => {
  res.send("SERVIDOR ACTIVO Y CONECTADO");
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "DATOS_INCOMPLETOS" });

  try {
    const userUpper = username.toUpperCase().trim();
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [userUpper]);
    
    if (result.rows.length > 0) {
      const match = await bcrypt.compare(password, result.rows[0].password);
      if (match) return res.status(200).json({ message: "ACCESO_OK", user: userUpper });
    }
    res.status(401).json({ error: "CREDENCIALES_INVALIDAS" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "ERROR_INTERNO_LOGIN" });
  }
});

// REGISTRO
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "DATOS_INCOMPLETOS" });

  try {
    const userUpper = username.toUpperCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username",
      [userUpper, hashedPassword]
    );
    res.status(201).json({ message: "REGISTRO_OK", user: result.rows[0].username });
  } catch (err) {
    console.error("ERROR DB:", err.message);
    if (err.code === '23505') return res.status(400).json({ error: "USUARIO_EXISTENTE" });
    res.status(500).json({ error: "ERROR_AL_GUARDAR_EN_DB" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVIDOR CORRIENDO EN PUERTO ${PORT}`);
});