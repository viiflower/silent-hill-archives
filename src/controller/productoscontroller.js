const db = require('../models/connection');

// 1. GET - Obtener todos los productos
exports.obtenerTodos = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM productos");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener:", err.message);
        res.status(500).send("Error al obtener productos");
    }
};

// 2. GET - Obtener un producto por ID
exports.obtenerPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query("SELECT * FROM productos WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Producto no encontrado");
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send("Error al buscar el producto");
    }
};

// 3. POST - Insertar un nuevo producto
exports.insertar = async (req, res) => {
    const { nombre, precio } = req.body;
    try {
        const query = "INSERT INTO productos (nombre, precio) VALUES ($1, $2)";
        await db.query(query, [nombre, precio]);
        res.send("Producto insertado correctamente");
    } catch (err) {
        console.log("EL ERROR REAL ES: ", err.message);
        res.status(500).send("Error al insertar producto: " + err.message);
    }
};

// 4. PUT - Actualizar todos los campos de un producto
exports.actualizarTotal = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio } = req.body;
    try {
        const query = "UPDATE productos SET nombre = $1, precio = $2 WHERE id = $3";
        await db.query(query, [nombre, precio, id]);
        res.send("Producto actualizado totalmente");
    } catch (err) {
        res.status(500).send("Error al actualizar producto");
    }
};

// 5. PATCH - Actualizar solo el precio (una columna)
exports.actualizarPrecio = async (req, res) => {
    const { id } = req.params;
    const { precio } = req.body;
    try {
        const query = "UPDATE productos SET precio = $1 WHERE id = $2";
        await db.query(query, [precio, id]);
        res.send("Precio del producto actualizado");
    } catch (err) {
        res.status(500).send("Error al actualizar el precio");
    }
};

// 6. DELETE - Eliminar un producto por ID
exports.eliminar = async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM productos WHERE id = $1";
        await db.query(query, [id]);
        res.send("Producto eliminado correctamente");
    } catch (err) {
        res.status(500).send("Error al eliminar producto");
    }
};