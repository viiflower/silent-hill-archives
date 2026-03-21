app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "IDENTIDAD_REQUERIDA" });
  }

  const upperUser = username.toUpperCase().trim(); 

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [upperUser]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password);
      
      if (match) {
        return res.status(200).json({ message: "ACCESO_CONCEDIDO", user: user.username });
      } else {
        return res.status(401).json({ error: "CLAVE_INCORRECTA" });
      }
    }
    
    res.status(401).json({ error: "EXPEDIENTE_NO_ENCONTRADO" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "FALLO_DE_SISTEMA_INTERNO" });
  }
});