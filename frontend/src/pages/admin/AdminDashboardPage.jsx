import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShoppingBag, DollarSign, AlertTriangle, TrendingUp, Package, Clock, ChefHat, CheckCircle, Activity } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-fade-in-up transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={24} style={{ color }} />
        </div>
        {sub && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-50 text-gray-500">{sub}</span>}
      </div>
      <p className="text-gray-500 font-medium text-sm mb-1">{label}</p>
      <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: '#1f2937' }}>{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, repRes] = await Promise.all([
          api.get('/reportes/dashboard'),
          api.get('/reportes/ventas?periodo=semana')
        ]);
        setDashboard(dashRes.data);
        setReporte(repRes.data);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const doughnutData = {
    labels: ['Recibidos', 'Preparando', 'Listos', 'Entregados'],
    datasets: [{
      data: [
        dashboard?.pedidos_por_estado?.recibido || 0,
        dashboard?.pedidos_por_estado?.preparando || 0,
        dashboard?.pedidos_por_estado?.listo || 0,
        dashboard?.pedidos_por_estado?.entregado || 0,
      ],
      backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#9ca3af'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const lineData = {
    labels: reporte?.ventas_por_dia?.map((v) => new Date(v.fecha + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'short' })) || [],
    datasets: [{
      label: 'Ingresos (S/)',
      data: reporte?.ventas_por_dia?.map((v) => v.ingresos) || [],
      borderColor: '#ff6b35',
      backgroundColor: 'rgba(255, 107, 53, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
    }],
  };

  return (
    <div className="p-4 md:p-8 pb-24 bg-gray-50 min-h-screen">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
          Visión General
        </h1>
        <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
          <Clock size={16} /> 
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Lima' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Pedidos Hoy" value={dashboard?.pedidos_hoy || 0} color="#ff6b35" />
        <StatCard icon={AlertTriangle} label="En Proceso" value={dashboard?.pedidos_pendientes || 0} sub="Pendientes" color="#f59e0b" />
        <StatCard icon={DollarSign} label="Ingresos Confirmados" value={`S/ ${(dashboard?.ingresos_entregados || 0).toFixed(2)}`} color="#22c55e" />
        <StatCard icon={Package} label="Agotados" value={dashboard?.total_productos_agotados || 0} sub="Stock cero" color="#dc3545" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Gráfico de Estados */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-gray-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Estado Operativo
          </h3>
          <div className="relative h-48 flex justify-center items-center">
            {(dashboard?.pedidos_hoy || 0) > 0 ? (
              <Doughnut 
                data={doughnutData} 
                options={{ cutout: '75%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20, font: { family: 'Inter', size: 12 } } } } }} 
              />
            ) : (
              <p className="text-gray-400 text-sm font-medium">Aún no hay pedidos hoy</p>
            )}
            {(dashboard?.pedidos_hoy || 0) > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-4xl font-black text-gray-800 leading-none">{dashboard?.pedidos_hoy}</span>
                <span className="text-xs text-gray-400 font-medium mt-1">Pedidos</span>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Tendencia */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>
              Tendencia de la Semana
            </h3>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <TrendingUp size={14} /> En vivo
            </span>
          </div>
          <div className="h-48">
            <Line 
              data={lineData} 
              options={{ 
                responsive: true, maintainAspectRatio: false, 
                plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { label: (ctx) => ` S/ ${ctx.parsed.y.toFixed(2)}` } } }, 
                scales: { x: { grid: { display: false } }, y: { beginAtZero: true, border: { dash: [4, 4] }, grid: { color: '#f3f4f6' }, ticks: { maxTicksLimit: 5 } } },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Alertas de Stock */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <Activity size={20} className="text-orange-500" /> Alertas de Inventario
        </h3>
        
        {dashboard?.productos_bajo_stock?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dashboard.productos_bajo_stock.map((p) => (
              <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border ${p.stock <= 2 ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                <div>
                  <p className="font-bold text-gray-800">{p.nombre}</p>
                  <p className="text-xs font-medium text-gray-500">{p.categoria}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${p.stock <= 2 ? 'bg-red-500 text-white shadow-sm shadow-red-200' : 'bg-orange-400 text-white shadow-sm shadow-orange-200'}`}>
                  {p.stock}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <p className="font-semibold text-gray-800">Inventario Saludable</p>
            <p className="text-sm text-gray-500">Ningún producto reporta bajo stock.</p>
          </div>
        )}
      </div>
    </div>
  );
}
