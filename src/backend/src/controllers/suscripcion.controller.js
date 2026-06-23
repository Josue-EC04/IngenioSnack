const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const webpush = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:julio@ingeniosnack.pe',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('[WEB-PUSH] Faltan las variables VAPID_PUBLIC_KEY o VAPID_PRIVATE_KEY. Las notificaciones push no funcionarán.');
}

// Obtener la suscripción actual del estudiante
exports.getSuscripcion = async (req, res) => {
  try {
    const suscripcion = await prisma.suscripcion.findUnique({
      where: { user_id: req.user.id },
      include: { bebida: true, snack: true }
    });
    
    if (!suscripcion) {
      return res.status(404).json({ message: 'No tienes una suscripción activa' });
    }
    
    res.json(suscripcion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener suscripción' });
  }
};

// Crear o actualizar suscripción
exports.upsertSuscripcion = async (req, res) => {
  try {
    const { bebida_id, snack_id, dias_activos, activa } = req.body;
    
    const suscripcion = await prisma.suscripcion.upsert({
      where: { user_id: req.user.id },
      update: {
        bebida_id,
        snack_id,
        dias_activos,
        activa: activa !== undefined ? activa : true
      },
      create: {
        user_id: req.user.id,
        bebida_id,
        snack_id,
        dias_activos: dias_activos || '1,2,3,4,5',
        activa: true
      },
      include: { bebida: true, snack: true }
    });
    
    res.json({ message: 'Suscripción guardada exitosamente', suscripcion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar suscripción' });
  }
};

// Registrar endpoint para notificaciones Web Push
exports.subscribeWebPush = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    
    if (!endpoint || !keys) {
      return res.status(400).json({ error: 'Faltan datos de la suscripción' });
    }
    
    // Guardar o actualizar la suscripción push
    await prisma.webPushSubscription.upsert({
      where: { endpoint: endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_id: req.user.id
      },
      create: {
        user_id: req.user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth
      }
    });
    
    res.json({ message: 'Suscripción Web Push exitosa' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar Web Push' });
  }
};

// --- RUTAS DE ADMINISTRADOR ---

// Obtener todas las suscripciones activas que aplican para el día actual
exports.getSuscripcionesDelDia = async (req, res) => {
  try {
    // Obtener el día actual (0=Domingo, 1=Lunes... 6=Sábado)
    const diaActual = new Date().getDay().toString();
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);
    
    // Obtener todas las suscripciones activas
    const suscripciones = await prisma.suscripcion.findMany({
      where: { activa: true },
      include: {
        user: { select: { id: true, nombre: true, correo: true } },
        bebida: true,
        snack: true
      }
    });
    
    // Filtrar en memoria por el día actual (ya que dias_activos es un string "1,2,3")
    const suscripcionesHoy = suscripciones
      .filter(sub => sub.dias_activos.split(',').includes(diaActual))
      .map(sub => {
        const preparadoHoy = sub.ultima_fecha_preparacion && 
          new Date(sub.ultima_fecha_preparacion) >= hoyInicio &&
          new Date(sub.ultima_fecha_preparacion) <= hoyFin;
          
        return { ...sub, estado_hoy: preparadoHoy ? 'listo' : 'pendiente' };
      });
    
    res.json(suscripcionesHoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener suscripciones del día' });
  }
};

// POST /api/suscripciones/admin/marcar-listo/:id
exports.marcarComboComoListo = async (req, res) => {
  try {
    const suscripcionId = parseInt(req.params.id);
    const io = req.app.get('io');
    
    const suscripcion = await prisma.suscripcion.findUnique({
      where: { id: suscripcionId },
      include: { bebida: true, snack: true }
    });
    
    if (!suscripcion) return res.status(404).json({ error: 'Suscripción no encontrada' });
    
    // Validar si ya fue preparado hoy
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    
    if (suscripcion.ultima_fecha_preparacion && new Date(suscripcion.ultima_fecha_preparacion) >= hoyInicio) {
      return res.status(400).json({ error: 'El combo ya fue preparado el día de hoy' });
    }
    
    let total = 0;
    const detallesData = [];
    
    if (suscripcion.bebida) {
      total += suscripcion.bebida.precio;
      detallesData.push({
        producto_id: suscripcion.bebida.id,
        cantidad: 1,
        precio_unitario: suscripcion.bebida.precio,
        subtotal: suscripcion.bebida.precio
      });
    }
    if (suscripcion.snack) {
      total += suscripcion.snack.precio;
      detallesData.push({
        producto_id: suscripcion.snack.id,
        cantidad: 1,
        precio_unitario: suscripcion.snack.precio,
        subtotal: suscripcion.snack.precio
      });
    }
    
    // Generar nuevo numero de pedido
    const ultimoPedido = await prisma.pedido.findFirst({ orderBy: { id: 'desc' } });
    const numeroPedido = `#${String((ultimoPedido ? ultimoPedido.id + 1 : 1)).padStart(4, '0')}`;
    
    // Transacción: Crear Pedido y actualizar Suscripción
    const pedido = await prisma.$transaction(async (tx) => {
      const nuevoPedido = await tx.pedido.create({
        data: {
          numero_pedido: numeroPedido,
          user_id: suscripcion.user_id,
          total,
          estado: 'listo', // Porque el administrador lo está marcando como listo para recoger
          detalles: { create: detallesData }
        },
        include: {
          detalles: { include: { producto: true } },
          user: { select: { id: true, nombre: true, correo: true } }
        }
      });
      
      // Actualizar suscripción
      await tx.suscripcion.update({
        where: { id: suscripcion.id },
        data: { ultima_fecha_preparacion: new Date() }
      });
      
      // Descontar stock
      for (const d of detallesData) {
        await tx.producto.update({
          where: { id: d.producto_id },
          data: { stock: { decrement: d.cantidad } }
        });
      }
      
      return nuevoPedido;
    });
    
    // Notificar al estudiante
    if (io) {
      io.emit('nuevo_pedido', pedido); // Para dashboard general
      io.emit('pedido_actualizado', pedido);
      io.to(`user_${pedido.user_id}`).emit('mi_pedido_actualizado', pedido);
      io.to(`user_${pedido.user_id}`).emit('pedido_creado', pedido);
    }
    
    res.json({ message: 'Combo preparado. Pedido generado exitosamente.', pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el combo' });
  }
};
