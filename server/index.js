const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'silent_hill_archives',
  password: 'Contrasena123',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send("SERVIDOR DE SILENT HILL ACTIVO - SISTEMA ONLINE");
});


app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    console.log("Usuario registrado:", username);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error en registro:", err.message);
    res.status(500).json({ error: "Error al crear el expediente." });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "No existe el usuario" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Acceso denegado" });
    }

    res.status(200).json({ message: "Bienvenido al sistema" });
  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error del servidor" });
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

app.post("/api/monsters", async (req, res) => {
  const { name, danger, description, image } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO monsters (name, danger, description, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, danger, description, image]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(`SERVIDOR CORRIENDO EN EL PUERTO ${PORT}`);
  console.log(`URL DE PRUEBA: http://localhost:${PORT}/`);
  console.log("=========================================");
});