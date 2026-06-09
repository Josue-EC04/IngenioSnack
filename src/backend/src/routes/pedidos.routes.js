const express = require('express');
const { createPedido, getPedidos, getPedidoById, updateEstadoPedido, getMiPedidoActivo } = require('../controllers/pedidos.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/activo', getMiPedidoActivo);
router.get('/', getPedidos);
router.get('/:id', getPedidoById);
router.post('/', createPedido);
router.patch('/:id/estado', adminMiddleware, updateEstadoPedido);

module.exports = router;
