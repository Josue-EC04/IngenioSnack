const express = require('express');
const { getProductos, getProductoById, createProducto, updateProducto, toggleProducto } = require('../controllers/productos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

// Rutas públicas (con auth opcional para admins)
router.get('/', (req, res, next) => {
  // Intentar auth pero no fallar si no hay token
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const jwt = require('jsonwebtoken');
      const token = authHeader.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      // Token inválido, continuar sin user
    }
  }
  next();
}, getProductos);

router.get('/:id', getProductoById);

// Rutas protegidas (solo admin)
router.post('/', authMiddleware, adminMiddleware, createProducto);
router.put('/:id', authMiddleware, adminMiddleware, updateProducto);
router.patch('/:id/toggle', authMiddleware, adminMiddleware, toggleProducto);

module.exports = router;
