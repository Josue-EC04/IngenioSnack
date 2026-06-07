const express = require('express');
const { getReporteVentas, getDashboard } = require('../controllers/reportes.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/ventas', getReporteVentas);
router.get('/dashboard', getDashboard);

module.exports = router;
