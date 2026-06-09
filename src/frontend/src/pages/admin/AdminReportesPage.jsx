import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  PointElement, LineElement, Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DollarSign, TrendingUp, Calendar, Download, BarChart3, Trophy, Receipt, Eye, X } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const PERIODOS = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Esta semana' },
  { key: 'mes', label: 'Este mes' },
  { key: 'personalizado', label: 'Personalizado' },
];

export default function AdminReportesPage() {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('hoy');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Estados para el Modal de Historial Diario
  const [modalFecha, setModalFecha] = useState(null);
  const [modalPedidos, setModalPedidos] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = async (fechaStr) => {
    setModalFecha(fechaStr);
    setModalLoading(true);
    try {
      const res = await api.get('/pedidos', { params: { fecha: fechaStr } });
      setModalPedidos(res.data);
    } catch (err) {
      toast.error('Error al cargar pedidos del día');
    } finally {
      setModalLoading(false);
    }
  };

  const fetchReporte = async () => {
    setLoading(true);
    try {
      const params = { periodo };
      if (periodo === 'personalizado') {
        params.desde = fechaDesde;
        params.hasta = fechaHasta;
      }
      const res = await api.get('/reportes/ventas', { params });
      setReporte(res.data);
    } catch (err) {
      toast.error('Error al cargar reporte');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReporte();
  }, [periodo]);

  const chartData = {
    labels: reporte?.top5_productos?.map((p) => p.nombre.slice(0, 15) + (p.nombre.length > 15 ? '…' : '')) || [],
    datasets: [
      {
        label: 'Unidades vendidas',
        data: reporte?.top5_productos?.map((p) => p.unidades_vendidas) || [],
        backgroundColor: ['#ff6b35', '#ffd700', '#3e1f00', '#22c55e', '#3b82f6'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} unidades`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const formatDia = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00'); // Evitar timezone offset issue
    if (periodo === 'semana' || periodo === 'hoy') {
      return fecha.toLocaleDateString('es-PE', { weekday: 'long' }).replace(/^\w/, (c) => c.toUpperCase());
    }
    return fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
  };

  const lineChartData = {
    labels: reporte?.ventas_por_dia?.map((v) => formatDia(v.fecha)) || [],
    datasets: [
      {
        label: 'Ingresos Diarios (S/)',
        data: reporte?.ventas_por_dia?.map((v) => v.ingresos) || [],
        borderColor: '#ff6b35',
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ff6b35',
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` S/ ${ctx.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { callback: (value) => `S/ ${value}` }
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Reportes de Ventas
        </h1>
      </div>

      {/* Filtros de período */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex gap-2 flex-wrap mb-3">
          {PERIODOS.map((p) => (
            <button
              key={p.key}
              id={`periodo-${p.key}`}
              onClick={() => setPeriodo(p.key)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={
                periodo === p.key
                  ? { background: '#3e1f00', color: 'white' }
                  : { background: '#f9f4ee', color: '#6b5c50' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {periodo === 'personalizado' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
              <input id="fecha-desde" type="date" className="input-field text-sm"
                value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
              <input id="fecha-hasta" type="date" className="input-field text-sm"
                value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </div>
            <button id="reportes-buscar" onClick={fetchReporte} className="btn-cafe col-span-2 justify-center">
              Consultar
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-24 rounded-2xl" />
          <div className="skeleton h-48 rounded-2xl" />
        </div>
      ) : reporte ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-3">
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={18} style={{ color: '#22c55e' }} />
                <p className="text-sm text-gray-500">Ingresos</p>
              </div>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                S/ {reporte.total_ingresos.toFixed(2)}
              </p>
            </div>
            <div className="stat-card">
              <div className="flex items-center gap-2 mb-2">
                <Receipt size={18} style={{ color: '#3b82f6' }} />
                <p className="text-sm text-gray-500">Ticket Promedio</p>
              </div>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                S/ {reporte.ticket_promedio?.toFixed(2) || '0.00'}
              </p>
            </div>
            {reporte.dia_mayor_venta && (
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} style={{ color: '#ffd700' }} />
                  <p className="text-sm text-gray-500">Mejor día</p>
                </div>
                <p className="font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                  {formatDia(reporte.dia_mayor_venta.fecha)}
                </p>
                <p className="text-sm text-gray-500">S/ {reporte.dia_mayor_venta.total.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Gráfico de Evolución Diaria */}
          {reporte.ventas_por_dia?.length > 0 && (
            <div className="glass rounded-2xl p-5 shadow-sm mb-4 h-80">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <TrendingUp size={18} className="text-orange-500" /> Evolución de Ingresos
              </h3>
              <div className="h-60">
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          )}

          {/* Tabla de Historial Diario */}
          {reporte.ventas_por_dia?.length > 0 && (
            <div className="glass rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <Calendar size={18} className="text-orange-500" /> Historial Diario
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-semibold">Fecha</th>
                      <th className="text-center py-2 text-gray-500 font-semibold">Pedidos</th>
                      <th className="text-right py-2 text-gray-500 font-semibold">Ingresos</th>
                      <th className="text-right py-2 text-gray-500 font-semibold">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.ventas_por_dia.map((dia) => (
                      <tr key={dia.fecha} className="border-b border-gray-50">
                        <td className="py-2.5 font-medium">{formatDia(dia.fecha)}</td>
                        <td className="py-2.5 text-center font-semibold text-gray-600">{dia.cantidad_pedidos}</td>
                        <td className="py-2.5 text-right font-bold text-green-600">S/ {dia.ingresos.toFixed(2)}</td>
                        <td className="py-2.5 text-right">
                          <button onClick={() => openModal(dia.fecha)} className="p-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors" title="Ver Pedidos">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Gráfico top 5 */}
          {reporte.top5_productos?.length > 0 ? (
            <div className="glass rounded-2xl p-5 shadow-sm mb-4">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <Trophy size={18} className="text-amber-500" /> Top 5 Productos Más Vendidos
              </h3>
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 shadow-sm mb-4 text-center">
              <div className="flex justify-center mb-2 text-gray-300">
                <BarChart3 size={48} strokeWidth={1.5} />
              </div>
              <p className="text-gray-500">No hay ventas en el período seleccionado</p>
            </div>
          )}

          {/* Tabla de productos */}
          {reporte.todos_los_productos?.length > 0 && (
            <div className="glass rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Tabla de Ventas por Producto
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-semibold">Producto</th>
                      <th className="text-right py-2 text-gray-500 font-semibold">Unidades</th>
                      <th className="text-right py-2 text-gray-500 font-semibold">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporte.todos_los_productos.map((p, i) => (
                      <tr key={p.producto_id} className={`border-b border-gray-50 ${i === 0 ? 'bg-amber-50' : ''}`}>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            {i < 3 && <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}>{i + 1}</span>}
                            <span className="font-medium">{p.nombre}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-right font-semibold" style={{ color: '#ff6b35' }}>
                          {p.unidades_vendidas}
                        </td>
                        <td className="py-2.5 text-right font-bold" style={{ color: '#3e1f00' }}>
                          S/ {p.ingresos.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : null}

      {/* Modal de Pedidos */}
      {modalFecha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <Calendar className="text-orange-500" size={20} /> Pedidos del {formatDia(modalFecha)}
              </h2>
              <button onClick={() => setModalFecha(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 bg-gray-50/30">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <span className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <p>Cargando pedidos...</p>
                </div>
              ) : modalPedidos.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No se encontraron pedidos para este día.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {modalPedidos.map((pedido) => (
                    <div key={pedido.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center border-b border-gray-50 pb-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{pedido.numero_pedido}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${pedido.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {pedido.estado}
                          </span>
                        </div>
                        <span className="font-bold text-green-600">S/ {pedido.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                        <span>Cliente: {pedido.user.nombre}</span>
                        <span>{new Date(pedido.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {pedido.detalles.map((detalle) => (
                          <div key={detalle.id} className="flex justify-between">
                            <span>{detalle.cantidad}x {detalle.producto.nombre}</span>
                            <span>S/ {detalle.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
