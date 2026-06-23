const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcion.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

router.use(authMiddleware);

// Rutas para estudiantes
router.get('/', suscripcionController.getSuscripcion);
router.post('/', suscripcionController.upsertSuscripcion);
router.post('/web-push', suscripcionController.subscribeWebPush);

// Rutas para administradores
router.get('/admin/dia', adminMiddleware, suscripcionController.getSuscripcionesDelDia);

module.exports = router;
