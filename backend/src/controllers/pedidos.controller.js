const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Generar número de pedido formateado (ej: #0042)
// Usa el timestamp + contador para garantizar unicidad ante concurrencia
const generarNumeroPedido = async () => {
  const ultimoPedido = await prisma.pedido.findFirst({
    orderBy: { id: 'desc' },
  });

  const numero = ultimoPedido ? ultimoPedido.id + 1 : 1;
  return `#${String(numero).padStart(4, '0')}`;
};

// Función para sumar puntos de fidelidad
const procesarPuntosFidelidad = async (pedidoId, userId, io) => {
  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      detalles: {
        include: { producto: true },
      },
      user: true,
    },
  });

  // Contar sándwiches entregados
  let sandwichesComprados = 0;
  for (const detalle of pedido.detalles) {
    if (detalle.producto.categoria === 'sandwiches') {
      sandwichesComprados += detalle.cantidad;
    }
  }

  if (sandwichesComprados === 0) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const puntosAntes = user.puntos_fidelidad;
  const puntosDespues = puntosAntes + sandwichesComprados;

  // Actualizar puntos
  await prisma.user.update({
    where: { id: userId },
    data: { puntos_fidelidad: puntosDespues },
  });

  // Registrar en historial
  await prisma.historialPuntos.create({
    data: {
      user_id: userId,
      pedido_id: pedidoId,
      puntos_ganados: sandwichesComprados,
      descripcion: `+${sandwichesComprados} punto(s) por sándwich(es) en pedido ${pedido.numero_pedido}`,
    },
  });

  // Generar cupones automáticos por cada múltiplo de 10 alcanzado
  const cuponesAntes = Math.floor(puntosAntes / 10);
  const cuponesDespues = Math.floor(puntosDespues / 10);
  const cuponesNuevos = cuponesDespues - cuponesAntes;

  for (let i = 0; i < cuponesNuevos; i++) {
    // Incluir timestamp + índice para evitar colisiones si se generan múltiples cupones
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codigo = `CAFE-${new Date().getFullYear()}-${timestamp.slice(-3)}${random}${i}`;

    try {
      await prisma.cuponFidelidad.create({
        data: {
          user_id: userId,
          codigo,
          tipo: 'cafe_americano',
        },
      });

      // Notificar por Socket.io
      if (io) {
        io.to(`user_${userId}`).emit('cupon_generado', {
          message: '🎉 ¡Felicitaciones! Has ganado un Café Americano gratis',
          codigo,
        });
      }
    } catch (createErr) {
      // Si hay colisión de código único (muy improbable), intentar con código diferente
      console.error('Error al crear cupón (posible colisión de código):', createErr);
    }
  }

  // Notificar puntos actualizados
  if (io) {
    io.to(`user_${userId}`).emit('puntos_actualizados', {
      puntos_fidelidad: puntosDespues,
      puntos_ganados: sandwichesComprados,
    });
  }
};

// POST /api/pedidos — Crear pedido
const createPedido = async (req, res) => {
  const { items, codigo_cupon } = req.body;
  const userId = req.user.id;
  const io = req.app.get('io');

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Formato de items inválido' });
  }

  if (items.length === 0 && !codigo_cupon) {
    return res.status(400).json({ error: 'El carrito está vacío y no se ha aplicado un cupón' });
  }

  try {
    // Obtener IDs de productos
    const productoIds = items.map((item) => item.producto_id);
    const productos = await prisma.producto.findMany({
      where: { id: { in: productoIds }, activo: true },
    });

    // Validar stock y detectar productos agotados
    const productosAgotados = [];
    for (const item of items) {
      const producto = productos.find((p) => p.id === item.producto_id);
      if (!producto) {
        productosAgotados.push({ producto_id: item.producto_id, nombre: 'Producto no disponible' });
      } else if (producto.stock < item.cantidad) {
        productosAgotados.push({ producto_id: item.producto_id, nombre: producto.nombre, stock_disponible: producto.stock });
      }
    }

    if (productosAgotados.length > 0) {
      return res.status(409).json({
        error: 'Algunos productos no tienen stock suficiente',
        productos_agotados: productosAgotados,
      });
    }

    // Calcular total (solo de los items del carrito, el café gratis no suma)
    let total = 0;
    const detallesData = items.map((item) => {
      const producto = productos.find((p) => p.id === item.producto_id);
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      return {
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio,
        subtotal,
      };
    });

    // Validar cupón si fue proporcionado
    let cupon = null;
    let cafePorCupon = null;

    if (codigo_cupon) {
      cupon = await prisma.cuponFidelidad.findUnique({
        where: { codigo: codigo_cupon },
      });

      if (!cupon) {
        return res.status(404).json({ error: 'Cupón no encontrado.' });
      }
      if (cupon.user_id !== userId) {
        return res.status(403).json({ error: 'Este cupón no te pertenece.' });
      }
      if (cupon.canjeado) {
        return res.status(409).json({ error: 'Este cupón ya fue canjeado anteriormente.' });
      }

      // Verificar stock del Café Americano
      cafePorCupon = await prisma.producto.findFirst({
        where: { nombre: 'Café Americano', activo: true },
      });

      if (!cafePorCupon || cafePorCupon.stock <= 0) {
        return res.status(409).json({
          error: 'El Café Americano se encuentra agotado/no disponible en este momento. Inténtalo más tarde.',
        });
      }

      // Agregar el Café Americano gratis a los detalles del pedido (precio 0)
      detallesData.push({
        producto_id: cafePorCupon.id,
        cantidad: 1,
        precio_unitario: 0,
        subtotal: 0,
      });
    }

    const numeroPedido = await generarNumeroPedido();

    // Crear pedido y descontar stock en una transacción
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          numero_pedido: numeroPedido,
          user_id: userId,
          total,
          estado: 'recibido',
          metodo_pago: 'contra_entrega',
          codigo_cupon: codigo_cupon || null,
          detalles: {
            create: detallesData,
          },
        },
        include: {
          detalles: {
            include: { producto: true },
          },
          user: {
            select: { id: true, nombre: true, correo: true },
          },
        },
      });

      // Descontar stock de los items del carrito
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.producto_id },
          data: {
            stock: { decrement: item.cantidad },
          },
        });

        // Si stock llega a 0, marcar como agotado
        const productoActual = await tx.producto.findUnique({ where: { id: item.producto_id } });
        if (productoActual.stock <= 0) {
          await tx.producto.update({
            where: { id: item.producto_id },
            data: { activo: false },
          });
        }
      }

      // Descontar stock del Café Americano si hay cupón
      if (cupon && cafePorCupon) {
        await tx.producto.update({
          where: { id: cafePorCupon.id },
          data: { stock: { decrement: 1 } },
        });

        // Si el stock del café llega a 0, marcarlo como agotado
        const cafeActual = await tx.producto.findUnique({ where: { id: cafePorCupon.id } });
        if (cafeActual.stock <= 0) {
          await tx.producto.update({
            where: { id: cafePorCupon.id },
            data: { activo: false },
          });
        }

        // Marcar cupón como canjeado
        await tx.cuponFidelidad.update({
          where: { codigo: codigo_cupon },
          data: {
            canjeado: true,
            fecha_canje: new Date(),
          },
        });
      }

      return nuevoPedido;
    });

    // Emitir nuevo pedido por Socket.io
    if (io) {
      io.emit('nuevo_pedido', pedido);
      io.to(`user_${userId}`).emit('pedido_creado', pedido);
    }

    res.status(201).json({
      message: `Tu pedido ${numeroPedido} está siendo preparado. Recógelo en la cafetería.`,
      pedido,
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

// GET /api/pedidos — Mis pedidos (estudiante) o todos los pedidos (admin)
const getPedidos = async (req, res) => {
  const { estado, fecha } = req.query;
  const userId = req.user.id;
  const esAdmin = req.user.rol === 'admin';

  try {
    const where = {};

    if (!esAdmin) {
      where.user_id = userId;
    }

    if (estado && estado !== 'todos') {
      where.estado = estado;
    }

    // Filtrar por fecha (hoy por defecto para admin)
    if (esAdmin) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const mañana = new Date(hoy);
      mañana.setDate(mañana.getDate() + 1);
      
      if (!fecha) {
        where.created_at = { gte: hoy, lt: mañana };
      } else if (fecha === 'hoy') {
        where.created_at = { gte: hoy, lt: mañana };
      }
    }

    const pedidos = await prisma.pedido.findMany({
      where,
      include: {
        detalles: {
          include: {
            producto: {
              select: { id: true, nombre: true, categoria: true },
            },
          },
        },
        user: {
          select: { id: true, nombre: true, correo: true, codigo_estudiante: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// GET /api/pedidos/:id — Obtener pedido por ID
const getPedidoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const esAdmin = req.user.rol === 'admin';

  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
      include: {
        detalles: {
          include: { producto: true },
        },
        user: {
          select: { id: true, nombre: true, correo: true },
        },
      },
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar acceso
    if (!esAdmin && pedido.user_id !== userId) {
      return res.status(403).json({ error: 'No tienes acceso a este pedido' });
    }

    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// PATCH /api/pedidos/:id/estado — Cambiar estado del pedido (solo admin)
const updateEstadoPedido = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const io = req.app.get('io');

  const estadosValidos = ['recibido', 'preparando', 'listo', 'entregado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
      include: {
        detalles: { include: { producto: true } },
        user: { select: { id: true, puntos_fidelidad: true } },
      },
    });

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: { estado },
      include: {
        detalles: {
          include: { producto: true },
        },
        user: {
          select: { id: true, nombre: true, correo: true },
        },
      },
    });

    // Avance a "entregado": sumar puntos de fidelidad
    if (estado === 'entregado' && pedidoExistente.estado !== 'entregado') {
      await procesarPuntosFidelidad(pedido.id, pedido.user_id, io);
    }

    // Retroceso desde "entregado": revertir puntos de fidelidad
    if (pedidoExistente.estado === 'entregado' && estado !== 'entregado') {
      let sandwichesComprados = 0;
      for (const detalle of pedidoExistente.detalles) {
        if (detalle.producto.categoria === 'sandwiches') {
          sandwichesComprados += detalle.cantidad;
        }
      }
      if (sandwichesComprados > 0) {
        const userActual = await prisma.user.findUnique({ where: { id: pedido.user_id } });
        const puntoNuevo = Math.max(0, userActual.puntos_fidelidad - sandwichesComprados);
        await prisma.user.update({
          where: { id: pedido.user_id },
          data: { puntos_fidelidad: puntoNuevo },
        });
        await prisma.historialPuntos.deleteMany({ where: { pedido_id: pedido.id } });
        if (io) {
          io.to(`user_${pedido.user_id}`).emit('puntos_actualizados', {
            puntos_fidelidad: puntoNuevo,
            puntos_ganados: -sandwichesComprados,
          });
        }
      }
    }

    // Emitir actualización por Socket.io
    if (io) {
      io.emit('pedido_actualizado', pedido);
      io.to(`user_${pedido.user_id}`).emit('mi_pedido_actualizado', pedido);
    }

    res.json({
      message: `Estado del pedido ${pedido.numero_pedido} actualizado a: ${estado}`,
      pedido,
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
};

// GET /api/pedidos/activo — Pedido activo del estudiante
const getMiPedidoActivo = async (req, res) => {
  const userId = req.user.id;

  try {
    const pedido = await prisma.pedido.findFirst({
      where: {
        user_id: userId,
        estado: { in: ['recibido', 'preparando', 'listo'] },
      },
      include: {
        detalles: {
          include: { producto: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido activo:', error);
    res.status(500).json({ error: 'Error al obtener pedido activo' });
  }
};

module.exports = { createPedido, getPedidos, getPedidoById, updateEstadoPedido, getMiPedidoActivo };
