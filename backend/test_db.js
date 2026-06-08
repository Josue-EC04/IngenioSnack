const { PrismaClient } = require('@prisma/client');
const { updateEstadoPedido } = require('./src/controllers/pedidos.controller');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.create({
    data: {
      nombre: 'Test Admin',
      correo: 'admin@test.com',
      password_hash: 'hash',
      rol: 'admin'
    }
  });

  const producto = await prisma.producto.create({
    data: {
      nombre: 'Cafe',
      precio: 5.0,
      categoria: 'bebidas',
      stock: 10
    }
  });

  const pedido = await prisma.pedido.create({
    data: {
      numero_pedido: '#9999',
      user_id: user.id,
      total: 5.0,
      estado: 'recibido',
      detalles: {
        create: [
          {
            producto_id: producto.id,
            cantidad: 1,
            precio_unitario: 5.0,
            subtotal: 5.0
          }
        ]
      }
    }
  });

  const req = {
    params: { id: pedido.id.toString() },
    body: { estado: 'preparando' },
    app: { get: () => null }
  };

  const res = {
    json: (data) => console.log('SUCCESS:', data.message),
    status: (code) => ({ json: (data) => console.log('ERROR:', code, data) })
  };

  await updateEstadoPedido(req, res);

  console.log('Update completed. Fetching to verify...');
  const updated = await prisma.pedido.findUnique({ where: { id: pedido.id } });
  console.log('Final estado:', updated.estado);
}

run().catch(console.error).finally(() => prisma.$disconnect());
