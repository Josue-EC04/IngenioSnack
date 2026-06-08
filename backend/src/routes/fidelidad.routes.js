const express = require('express');
const { getMisFidelidad, getAllCupones, canjearCupon, buscarCupon, validarCupon } = require('../controllers/fidelidad.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/mis-puntos', getMisFidelidad);
router.get('/validar/:codigo', validarCupon);          // Estudiante: validar cupón en carrito
router.get('/cupones', adminMiddleware, getAllCupones);
router.get('/buscar-cupon/:codigo', adminMiddleware, buscarCupon);
router.patch('/cupones/:codigo/canjear', adminMiddleware, canjearCupon);

module.exports = router;
