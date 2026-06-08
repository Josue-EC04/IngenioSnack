const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/fidelidad/mis-puntos — Puntos y cupones del estudiante
const getMisFidelidad = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        puntos_fidelidad: true,
        nombre: true,
      },
    });

    const cupones = await prisma.cuponFidelidad.findMany({
      where: { user_id: userId },
      orderBy: { fecha_generacion: 'desc' },
    });

    const historial = await prisma.historialPuntos.findMany({
      where: { user_id: userId },
      include: {
        pedido: { select: { numero_pedido: true } },
      },
      orderBy: { created_at: 'desc' },
      take: 20,
    });

    const puntosActuales = user.puntos_fidelidad;
    const progreso = puntosActuales % 10;
    const cuponesDisponibles = cupones.filter((c) => !c.canjeado).length;

    res.json({
      puntos_fidelidad: puntosActuales,
      progreso_actual: progreso,
      puntos_para_siguiente: 10 - progreso,
      cupones,
      cupones_disponibles: cuponesDisponibles,
      historial,
    });
  } catch (error) {
    console.error('Error al obtener fidelidad:', error);
    res.status(500).json({ error: 'Error al obtener datos de fidelidad' });
  }
};

// GET /api/fidelidad/cupones — Todos los cupones (admin)
const getAllCupones = async (req, res) => {
  try {
    const cupones = await prisma.cuponFidelidad.findMany({
      include: {
        user: { select: { nombre: true, correo: true, codigo_estudiante: true } },
      },
      orderBy: { fecha_generacion: 'desc' },
    });

    res.json(cupones);
  } catch (error) {
    console.error('Error al obtener cupones:', error);
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
};

// PATCH /api/fidelidad/cupones/:codigo/canjear — Canjear cupón (admin)
const canjearCupon = async (req, res) => {
  const { codigo } = req.params;

  try {
    const cupon = await prisma.cuponFidelidad.findUnique({
      where: { codigo },
      include: {
        user: { select: { nombre: true, correo: true } },
      },
    });

    if (!cupon) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    if (cupon.canjeado) {
      return res.status(409).json({
        error: 'Este cupón ya fue canjeado',
        fecha_canje: cupon.fecha_canje,
      });
    }

    const cuponActualizado = await prisma.cuponFidelidad.update({
      where: { codigo },
      data: {
        canjeado: true,
        fecha_canje: new Date(),
      },
      include: {
        user: { select: { nombre: true, correo: true } },
      },
    });

    res.json({
      message: `Cupón ${codigo} canjeado exitosamente`,
      cupon: cuponActualizado,
    });
  } catch (error) {
    console.error('Error al canjear cupón:', error);
    res.status(500).json({ error: 'Error al canjear cupón' });
  }
};

// GET /api/fidelidad/buscar-cupon/:codigo — Buscar cupón por código (admin)
const buscarCupon = async (req, res) => {
  const { codigo } = req.params;

  try {
    const cupon = await prisma.cuponFidelidad.findUnique({
      where: { codigo },
      include: {
        user: { select: { nombre: true, correo: true, codigo_estudiante: true } },
      },
    });

    if (!cupon) {
      return res.status(404).json({ error: 'Cupón no encontrado' });
    }

    res.json(cupon);
  } catch (error) {
    console.error('Error al buscar cupón:', error);
    res.status(500).json({ error: 'Error al buscar cupón' });
  }
};

// GET /api/fidelidad/validar/:codigo — Validar cupón para canje en carrito (estudiante)
const validarCupon = async (req, res) => {
  const { codigo } = req.params;
  const userId = req.user.id;

  try {
    const cupon = await prisma.cuponFidelidad.findUnique({
      where: { codigo },
      include: {
        user: { select: { nombre: true, correo: true } },
      },
    });

    if (!cupon) {
      return res.status(404).json({ error: 'Cupón no encontrado. Verifica el código e intenta de nuevo.' });
    }

    if (cupon.user_id !== userId) {
      return res.status(403).json({ error: 'Este cupón no te pertenece.' });
    }

    if (cupon.canjeado) {
      return res.status(409).json({ error: 'Este cupón ya fue canjeado anteriormente.' });
    }

    // Verificar stock de Café Americano
    const cafe = await prisma.producto.findFirst({
      where: { nombre: 'Café Americano', activo: true },
    });

    if (!cafe || cafe.stock <= 0) {
      return res.status(409).json({
        error: 'El Café Americano se encuentra agotado/no disponible en este momento. Inténtalo más tarde.',
      });
    }

    res.json({
      valido: true,
      cupon: {
        id: cupon.id,
        codigo: cupon.codigo,
        tipo: cupon.tipo,
        fecha_generacion: cupon.fecha_generacion,
      },
      regalo: {
        id: cafe.id,
        nombre: cafe.nombre,
        precio: 0,
      },
    });
  } catch (error) {
    console.error('Error al validar cupón:', error);
    res.status(500).json({ error: 'Error al validar el cupón' });
  }
};

module.exports = { getMisFidelidad, getAllCupones, canjearCupon, buscarCupon, validarCupon };
