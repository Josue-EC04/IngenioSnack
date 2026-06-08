const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/reportes/ventas — Reporte de ventas
const getReporteVentas = async (req, res) => {
  const { desde, hasta, periodo } = req.query;

  try {
    let fechaDesde, fechaHasta;
    const ahora = new Date();

    if (periodo === 'hoy' || (!periodo && !desde)) {
      fechaDesde = new Date(ahora);
      fechaDesde.setHours(0, 0, 0, 0);
      fechaHasta = new Date(ahora);
      fechaHasta.setHours(23, 59, 59, 999);
    } else if (periodo === 'semana') {
      fechaDesde = new Date(ahora);
      fechaDesde.setDate(ahora.getDate() - 7);
      fechaDesde.setHours(0, 0, 0, 0);
      fechaHasta = new Date(ahora);
      fechaHasta.setHours(23, 59, 59, 999);
    } else if (periodo === 'mes') {
      fechaDesde = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      fechaHasta = new Date(ahora);
      fechaHasta.setHours(23, 59, 59, 999);
    } else if (desde && hasta) {
      fechaDesde = new Date(desde);
      fechaDesde.setHours(0, 0, 0, 0);
      fechaHasta = new Date(hasta);
      fechaHasta.setHours(23, 59, 59, 999);
    } else {
      fechaDesde = new Date(ahora);
      fechaDesde.setHours(0, 0, 0, 0);
      fechaHasta = new Date(ahora);
      fechaHasta.setHours(23, 59, 59, 999);
    }

    // Pedidos entregados en el período
    const pedidosEntregados = await prisma.pedido.findMany({
      where: {
        estado: 'entregado',
        created_at: { gte: fechaDesde, lte: fechaHasta },
      },
      include: {
        detalles: {
          include: { producto: true },
        },
      },
    });

    // Calcular total de ingresos
    const totalIngresos = pedidosEntregados.reduce((sum, p) => sum + p.total, 0);

    // Calcular ventas por producto (excluir ítems de cupón gratis)
    const ventasPorProducto = {};
    for (const pedido of pedidosEntregados) {
      for (const detalle of pedido.detalles) {
        // Omitir el café americano gratis (canjeado por cupón, precio = 0)
        if (detalle.precio_unitario === 0) continue;
        const key = detalle.producto_id;
        if (!ventasPorProducto[key]) {
          ventasPorProducto[key] = {
            producto_id: detalle.producto_id,
            nombre: detalle.producto.nombre,
            categoria: detalle.producto.categoria,
            unidades_vendidas: 0,
            ingresos: 0,
          };
        }
        ventasPorProducto[key].unidades_vendidas += detalle.cantidad;
        ventasPorProducto[key].ingresos += detalle.subtotal;
      }
    }

    const productosOrdenados = Object.values(ventasPorProducto)
      .sort((a, b) => b.unidades_vendidas - a.unidades_vendidas);

    const top5Productos = productosOrdenados.slice(0, 5);

    // Ventas agrupadas por día
    const ventasPorDia = {};
    for (const pedido of pedidosEntregados) {
      const dia = pedido.created_at.toISOString().split('T')[0];
      if (!ventasPorDia[dia]) {
        ventasPorDia[dia] = { fecha: dia, ingresos: 0, cantidad_pedidos: 0 };
      }
      ventasPorDia[dia].ingresos += pedido.total;
      ventasPorDia[dia].cantidad_pedidos += 1;
    }

    // Ordenar los días cronológicamente
    const historialDiario = Object.values(ventasPorDia).sort((a, b) => a.fecha.localeCompare(b.fecha));

    const diaMayorVenta = Object.entries(ventasPorDia)
      .sort(([, a], [, b]) => b.ingresos - a.ingresos)[0];

    const ticketPromedio = pedidosEntregados.length > 0 ? totalIngresos / pedidosEntregados.length : 0;

    res.json({
      periodo: { desde: fechaDesde, hasta: fechaHasta },
      total_pedidos: pedidosEntregados.length,
      total_ingresos: totalIngresos,
      ticket_promedio: ticketPromedio,
      dia_mayor_venta: diaMayorVenta ? { fecha: diaMayorVenta[0], total: diaMayorVenta[1].ingresos } : null,
      ventas_por_dia: historialDiario,
      top5_productos: top5Productos,
      todos_los_productos: productosOrdenados,
    });
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ error: 'Error al generar reporte de ventas' });
  }
};

// GET /api/reportes/dashboard — Resumen del día para el dashboard admin
const getDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    // Pedidos de hoy
    const pedidosHoy = await prisma.pedido.findMany({
      where: { created_at: { gte: hoy, lt: mañana } },
    });

    const ingresosPendientes = pedidosHoy
      .filter((p) => p.estado !== 'entregado')
      .reduce((sum, p) => sum + p.total, 0);

    const ingresosEntregados = pedidosHoy
      .filter((p) => p.estado === 'entregado')
      .reduce((sum, p) => sum + p.total, 0);

    const pedidosPorEstado = {
      recibido: pedidosHoy.filter((p) => p.estado === 'recibido').length,
      preparando: pedidosHoy.filter((p) => p.estado === 'preparando').length,
      listo: pedidosHoy.filter((p) => p.estado === 'listo').length,
      entregado: pedidosHoy.filter((p) => p.estado === 'entregado').length,
    };

    // Productos con poco stock
    const productosBajoStock = await prisma.producto.findMany({
      where: { stock: { lte: 5 }, activo: true },
      orderBy: { stock: 'asc' },
    });

    // Productos agotados
    const productosAgotados = await prisma.producto.count({
      where: { OR: [{ stock: 0 }, { activo: false }] },
    });

    res.json({
      pedidos_hoy: pedidosHoy.length,
      pedidos_pendientes: pedidosPorEstado.recibido + pedidosPorEstado.preparando,
      ingresos_entregados: ingresosEntregados,
      ingresos_pendientes: ingresosPendientes,
      pedidos_por_estado: pedidosPorEstado,
      productos_bajo_stock: productosBajoStock,
      total_productos_agotados: productosAgotados,
    });
  } catch (error) {
    console.error('Error al obtener dashboard:', error);
    res.status(500).json({ error: 'Error al obtener datos del dashboard' });
  }
};

module.exports = { getReporteVentas, getDashboard };
