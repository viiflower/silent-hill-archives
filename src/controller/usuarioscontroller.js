const db = require('../models/connection');

// Aquí están todas las funciones que antes tenías en el index
exports.obtenerTodos = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) { res.status(500).send("Error al obtener datos :c"); }
};

exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM usuarios WHERE id = $1", [id]);
        res.json(result.rows[0]);
    } catch (err) { res.status(500).send("Usuario no encontrado"); }
};

exports.insertar = async (req, res) => {
    const { usuario, password } = req.body;
    try {
        await db.query("INSERT INTO usuarios (usuario, password) VALUES ($1, $2)", [usuario, password]);
        res.send("Datos insertados correctamente");
    } catch (err) { res.status(500).send("Error al insertar"); }
};

exports.actualizarTotal = async (req, res) => {
    const { id } = req.params;
    const { usuario, password } = req.body;
    try {
        await db.query("UPDATE usuarios SET usuario = $1, password = $2 WHERE id = $3", [usuario, password, id]);
        res.send("Usuario actualizado totalmente");
    } catch (err) { res.status(500).send("Error al actualizar"); }
};

exports.actualizarPass = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        await db.query("UPDATE usuarios SET password = $1 WHERE id = $2", [password, id]);
        res.send("Password actualizado");
    } catch (err) { res.status(500).send("Error en patch"); }
};

exports.eliminar = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM usuarios WHERE id = $1", [id]);
        res.send("Usuario eliminado");
    } catch (err) { res.status(500).send("Error al eliminar"); }
};