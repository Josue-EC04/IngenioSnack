import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DollarSign, TrendingUp, Calendar, Download, BarChart3, Trophy } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
                <TrendingUp size={18} style={{ color: '#ff6b35' }} />
                <p className="text-sm text-gray-500">Pedidos</p>
              </div>
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                {reporte.total_pedidos}
              </p>
            </div>
            {reporte.dia_mayor_venta && (
              <div className="stat-card col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} style={{ color: '#ffd700' }} />
                  <p className="text-sm text-gray-500">Mejor día</p>
                </div>
                <p className="font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                  {new Date(reporte.dia_mayor_venta.fecha).toLocaleDateString('es-PE', { timeZone: 'UTC' })}
                </p>
                <p className="text-sm text-gray-500">S/ {reporte.dia_mayor_venta.total.toFixed(2)}</p>
              </div>
            )}
          </div>

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
    </div>
  );
}
