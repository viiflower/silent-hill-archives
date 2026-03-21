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

// Conexión usando las variables separadas de Render
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

// --- RUTAS DE PERSONAJES (PERSONNEL) ---

// Obtener todos los personajes
app.get('/api/characters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM characters ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_OBTENER_PERSONAJES' });
  }
});

// Crear un personaje nuevo
app.post('/api/characters', async (req, res) => {
  const { name, status, imageUrl, description } = req.body;
  if(!name || !status || !description) return res.status(400).json({ error: 'DATOS_INCOMPLETOS' });
  
  try {
    const result = await pool.query(
      'INSERT INTO characters (name, status, imageUrl, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase().trim(), status.toUpperCase().trim(), imageUrl, description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_CREAR_PERSONAJE' });
  }
});

// --- RUTAS DE MONSTRUOS (MONSTERS) ---

// Obtener todos los monstruos
app.get('/api/monsters', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monsters ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_OBTENER_MONSTRUOS' });
  }
});

// Crear un monstruo nuevo
app.post('/api/monsters', async (req, res) => {
  const { name, dangerLevel, imageUrl, description } = req.body;
  if(!name || !dangerLevel || !description) return res.status(400).json({ error: 'DATOS_INCOMPLETOS' });
  
  try {
    const result = await pool.query(
      'INSERT INTO monsters (name, dangerLevel, imageUrl, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase().trim(), dangerLevel.toUpperCase().trim(), imageUrl, description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_CREAR_MONSTRUO' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVIDOR CORRIENDO EN PUERTO ${PORT}`);
});