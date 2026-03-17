const express = require('express');
const router = express.Router();

const funciones = require("../controller/crud.js")

router.get("/api/saludo", funciones.saludo);

router.post("/api/insertar",funciones.insertardatos);

module.exports = router;