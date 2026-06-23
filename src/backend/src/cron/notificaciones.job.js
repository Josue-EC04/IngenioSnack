const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:julio@ingeniosnack.pe',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Función que se ejecuta todos los días a las 7:00 AM
// "0 7 * * *" en producción (en este caso lo configuramos para ejecutarse)
const initCronJobs = () => {
  cron.schedule('0 7 * * *', async () => {
    console.log('[CRON] Iniciando envío de notificaciones de suscripción (7:00 AM)...');
    try {
      const diaActual = new Date().getDay().toString();
      
      const suscripcionesDelDia = await prisma.suscripcion.findMany({
        where: { activa: true },
        include: {
          user: { include: { push_subscriptions: true } },
          bebida: true,
          snack: true
        }
      });
      
      const aNotificar = suscripcionesDelDia.filter(sub => 
        sub.dias_activos.split(',').includes(diaActual) && 
        sub.user.push_subscriptions.length > 0
      );
      
      console.log(`[CRON] Se encontraron ${aNotificar.length} estudiantes a notificar.`);
      
      for (const sub of aNotificar) {
        const payload = JSON.stringify({
          title: `¡Buenos días, ${sub.user.nombre.split(' ')[0]}! 👋`,
          body: `Tu combo de hoy (${sub.bebida.nombre} + ${sub.snack.nombre}) te espera. ¿Confirmas tu pedido por S/ ${(sub.bebida.precio + sub.snack.precio).toFixed(2)}?`,
          icon: '/ingenio-logo.png', // Asumiendo que existe
          url: '/perfil',
          data: { suscripcionId: sub.id }
        });
        
        for (const pushSub of sub.user.push_subscriptions) {
          const pushConfig = {
            endpoint: pushSub.endpoint,
            keys: {
              p256dh: pushSub.p256dh,
              auth: pushSub.auth
            }
          };
          
          try {
            await webpush.sendNotification(pushConfig, payload);
          } catch (error) {
            console.error(`[CRON] Error al enviar push a usuario ${sub.user_id}:`, error);
            if (error.statusCode === 410 || error.statusCode === 404) {
              // La suscripción expiró o ya no es válida, la eliminamos
              await prisma.webPushSubscription.delete({ where: { id: pushSub.id } });
            }
          }
        }
      }
      
      console.log('[CRON] Envío de notificaciones finalizado.');
    } catch (error) {
      console.error('[CRON] Error crítico al ejecutar tarea:', error);
    }
  }, {
    timezone: "America/Lima"
  });
  
  console.log('[CRON] Jobs inicializados correctamente.');
};

module.exports = { initCronJobs };
