function  saludo (req, res) {
    res.json({message: "Hola desde el controlador de CRUD"});
}
async function obtenerlosdatos(req, res) {
    try {
        const query = "SELECT * FROM usuarios";
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Error al obtener datos del servidor :c");
    }
}
async function obtenerconid(req, res) {
    const { id } = req.params;
    try {
        const query = "SELECT * FROM usuarios WHERE id = $1";
        const result = await db.query(query, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Error al obtener el usuario / ID no encontrado :p");
    }
}

async function insertardatos(req, res) {
     const { usuario, password } = req.body;
    try {
        const query = "INSERT INTO usuarios (usuario, password) VALUES ($1, $2)";
        await db.query(query, [usuario, password]);
        res.send("Datos insertados correctamente");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al insertar datos dentro de la base de datos :o");
    }
}

async function actualizardatos(res, res) {
    const { id } = req.params;
    const { usuario, password } = req.body;
    try {
        const query = "UPDATE usuarios SET usuario = $1, password = $2 WHERE id = $3";
        await db.query(query, [usuario, password, id]);
        res.send("Usuario actualizado totalmente");
    } catch (err) {
        res.status(500).send("Error al actualizar los datos xp");
    }
    
}

async function actualizarunacolumna(req, res) {
        const { id } = req.params;
    const { password } = req.body;
    try {
        const query = "UPDATE usuarios SET password = $1 WHERE id = $2";
        await db.query(query, [password, id]);
        res.send("Password actualizado");
    } catch (err) {
        res.status(500).send("Error al actualizar la columna password :/");
    }

}

async function deleteoborrarfila(req, res) {
    const { id } = req.params;
    try {
        const query = "DELETE FROM usuarios WHERE id = $1";
        await db.query(query, [id]);
        res.send("Usuario eliminado correctamente");
    } catch (err) {
        res.status(500).send("Error al eliminar el usuario :/");
    }
}