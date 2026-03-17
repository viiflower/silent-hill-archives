const express = require('express');
const router = express.Router();
const controller = require('../controller/usuarioscontroller');

router.get("/", controller.obtenerTodos);
router.get("/:id", controller.obtenerPorId);
router.post("/insertar", controller.insertar);
router.put("/actualizar/:id", controller.actualizarTotal);
router.patch("/actualizar-password/:id", controller.actualizarPass);
router.delete("/eliminar/:id", controller.eliminar);

module.exports = router;