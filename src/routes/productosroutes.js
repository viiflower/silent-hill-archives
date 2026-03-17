const express = require('express');
const router = express.Router();
const controller = require('../controller/productoscontroller');

router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.post("/insertar", controller.insertar);
router.put("/actualizar/:id", controller.actualizarTotal);
router.patch("/actualizar-precio/:id", controller.actualizarPrecio);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;