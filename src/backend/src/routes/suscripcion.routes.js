const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcion.controller');
const { verificarToken, esEstudiante, esAdmin } = require('../middlewares/auth');

// Rutas para estudiantes
router.get('/', verificarToken, esEstudiante, suscripcionController.getSuscripcion);
router.post('/', verificarToken, esEstudiante, suscripcionController.upsertSuscripcion);
router.post('/web-push', verificarToken, esEstudiante, suscripcionController.subscribeWebPush);

// Rutas para administradores
router.get('/admin/dia', verificarToken, esAdmin, suscripcionController.getSuscripcionesDelDia);

module.exports = router;
