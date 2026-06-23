const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:julio@ingeniosnack.pe',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

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
    const suscripcionesHoy = suscripciones.filter(sub => 
      sub.dias_activos.split(',').includes(diaActual)
    );
    
    res.json(suscripcionesHoy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener suscripciones del día' });
  }
};
