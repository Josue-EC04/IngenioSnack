const express = require('express');
const { getMisFidelidad, getAllCupones, canjearCupon, buscarCupon } = require('../controllers/fidelidad.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/mis-puntos', getMisFidelidad);
router.get('/cupones', adminMiddleware, getAllCupones);
router.get('/buscar-cupon/:codigo', adminMiddleware, buscarCupon);
router.patch('/cupones/:codigo/canjear', adminMiddleware, canjearCupon);

module.exports = router;
