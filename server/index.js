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

// Conexión usando las variables de Render
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

// --- LOGIN & REGISTRO (Sin cambios, ya que la tabla users no varió) ---
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
    if (err.code === '23505') return res.status(400).json({ error: "USUARIO_EXISTENTE" });
    res.status(500).json({ error: "ERROR_AL_GUARDAR_EN_DB" });
  }
});

// --- RUTAS DE PERSONAJES (CORREGIDAS) ---

app.get('/api/characters', async (req, res) => {
  try {
    // CORRECCIÓN: Se cambió 'id' por 'char_id'
    const result = await pool.query('SELECT * FROM characters ORDER BY char_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_OBTENER_PERSONAJES' });
  }
});

app.post('/api/characters', async (req, res) => {
  // CORRECCIÓN: El frontend envía 'image', no 'imageUrl'
  const { name, status, image, description } = req.body;
  if(!name || !status || !description) return res.status(400).json({ error: 'DATOS_INCOMPLETOS' });
  
  try {
    // CORRECCIÓN: La columna se llama 'image'
    const result = await pool.query(
      'INSERT INTO characters (name, status, image, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [name.toUpperCase().trim(), status.toUpperCase().trim(), image, description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error en Characters POST:", err.message);
    res.status(500).json({ error: 'ERROR_AL_CREAR_PERSONAJE' });
  }
});

// --- RUTAS DE MONSTRUOS (CORREGIDAS) ---

app.get('/api/monsters', async (req, res) => {
  try {
    // CORRECCIÓN: Se cambió 'id' por 'monster_id'
    const result = await pool.query('SELECT * FROM monsters ORDER BY monster_id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ERROR_AL_OBTENER_MONSTRUOS' });
  }
});

app.post('/api/monsters', async (req, res) => {
  // CORRECCIÓN: Recibimos 'danger' y 'encounter_location'
  const { name, danger, image, description, encounter_location } = req.body;
  if(!name || !danger || !description) return res.status(400).json({ error: 'DATOS_INCOMPLETOS' });
  
  try {
    // CORRECCIÓN: Columnas 'danger' y 'description' (antes dangerLevel y notes)
    // Se incluye 'encounter_location' porque es obligatorio en tu SQL
    const result = await pool.query(
      'INSERT INTO monsters (name, danger, image, description, encounter_location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        name.toUpperCase().trim(), 
        danger.toUpperCase().trim(), 
        image, 
        description.trim(), 
        encounter_location || "UNKNOWN"
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error en Monsters POST:", err.message);
    res.status(500).json({ error: 'ERROR_AL_CREAR_MONSTRUO' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVIDOR CORRIENDO EN PUERTO ${PORT}`);
});