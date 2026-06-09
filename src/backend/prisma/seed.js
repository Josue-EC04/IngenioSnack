const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.historialPuntos.deleteMany();
  await prisma.cuponFidelidad.deleteMany();
  await prisma.detallePedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.user.deleteMany();

  // Crear admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      nombre: 'Julio Cafetero',
      correo: 'julio@ingeniosnack.pe',
      password_hash: adminPassword,
      rol: 'admin',
    },
  });
  console.log('✅ Admin creado:', admin.correo);

  // Crear estudiante de prueba
  const estudiantePassword = await bcrypt.hash('estudiante123', 10);
  const estudiante = await prisma.user.create({
    data: {
      nombre: 'Ana García',
      correo: 'ana.garcia@uncp.edu.pe',
      codigo_estudiante: '2021100123',
      password_hash: estudiantePassword,
      rol: 'estudiante',
      puntos_fidelidad: 7, // Para demostrar barra de progreso
    },
  });
  console.log('✅ Estudiante creado:', estudiante.correo);

  // Crear productos
  const productos = [
    // Sándwiches
    {
      nombre: 'Sándwich de Pollo',
      descripcion: 'Delicioso sándwich con pollo a la plancha, lechuga, tomate y mayonesa',
      precio: 4.50,
      categoria: 'sandwiches',
      stock: 20,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Sándwich Mixto',
      descripcion: 'Sándwich con jamón, queso y vegetales frescos',
      precio: 3.50,
      categoria: 'sandwiches',
      stock: 15,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Sándwich de Jamón y Queso',
      descripcion: 'Clásico sándwich con jamón premium y queso derretido',
      precio: 4.00,
      categoria: 'sandwiches',
      stock: 18,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&q=80&w=800',
    },
    // Bebidas
    {
      nombre: 'Café Americano',
      descripcion: 'Café negro recién preparado, tamaño mediano',
      precio: 2.00,
      categoria: 'bebidas',
      stock: 50,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Café con Leche',
      descripcion: 'Café suave con leche entera caliente',
      precio: 2.50,
      categoria: 'bebidas',
      stock: 40,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Agua San Luis 625ml',
      descripcion: 'Agua mineral natural sin gas',
      precio: 1.50,
      categoria: 'bebidas',
      stock: 30,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=800',
    },
    // Snacks
    {
      nombre: 'Galletas Oreo',
      descripcion: 'Paquete individual de galletas Oreo originales',
      precio: 1.00,
      categoria: 'snacks',
      stock: 25,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1620921575023-ecda8b78d227?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Chifles',
      descripcion: 'Chifles de plátano verde crujientes, bolsa individual',
      precio: 1.50,
      categoria: 'snacks',
      stock: 20,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&q=80&w=800',
    },
    {
      nombre: 'Keke',
      descripcion: 'Queque esponjoso de vainilla, porción individual',
      precio: 2.00,
      categoria: 'snacks',
      stock: 10,
      activo: true,
      imagen_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    },
  ];

  for (const producto of productos) {
    await prisma.producto.create({ data: producto });
  }
  console.log(`✅ ${productos.length} productos creados`);

  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('Credenciales de acceso:');
  console.log('  Admin:      julio@ingeniosnack.pe / admin123');
  console.log('  Estudiante: ana.garcia@uncp.edu.pe / estudiante123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
