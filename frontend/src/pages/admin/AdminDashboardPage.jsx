import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ShoppingBag, DollarSign, AlertTriangle, TrendingUp, Coffee, Package, Clock, ChefHat, CheckCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="stat-card animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/reportes/dashboard');
        setDashboard(res.data);
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Lima' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Pedidos hoy"
          value={dashboard?.pedidos_hoy || 0}
          color="#ff6b35"
        />
        <StatCard
          icon={AlertTriangle}
          label="Pendientes"
          value={dashboard?.pedidos_pendientes || 0}
          sub="Sin entregar"
          color="#f59e0b"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos hoy"
          value={`S/ ${(dashboard?.ingresos_entregados || 0).toFixed(2)}`}
          sub="Pedidos entregados"
          color="#22c55e"
        />
        <StatCard
          icon={Package}
          label="Agotados"
          value={dashboard?.total_productos_agotados || 0}
          sub="Productos"
          color="#dc3545"
        />
      </div>

      {/* Desglose por estado */}
      <div className="glass rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-gray-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Pedidos por Estado
        </h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { estado: 'recibido',   icon: Clock,       label: 'Recibidos',   color: '#f59e0b', bg: '#fef3c7' },
            { estado: 'preparando', icon: ChefHat,     label: 'Preparando',  color: '#3b82f6', bg: '#dbeafe' },
            { estado: 'listo',      icon: CheckCircle, label: 'Listos',       color: '#22c55e', bg: '#dcfce7' },
            { estado: 'entregado',  icon: Package,     label: 'Entregados',   color: '#6b7280', bg: '#f3f4f6' },
          ].map((item) => (
            <div key={item.estado} className="rounded-xl p-4 text-center transition-transform hover:scale-105" style={{ background: item.bg, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <div className="flex justify-center mb-2" style={{ color: item.color }}><item.icon size={28} strokeWidth={1.5} /></div>
              <p className="text-2xl font-bold" style={{ color: item.color, fontFamily: 'var(--font-display)' }}>
                {dashboard?.pedidos_por_estado?.[item.estado] || 0}
              </p>
              <p className="text-xs font-medium" style={{ color: item.color }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Productos con bajo stock */}
      {dashboard?.productos_bajo_stock?.length > 0 && (
        <div className="glass rounded-2xl p-6 animate-fade-in-up">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            Productos con Poco Stock
          </h3>
          <div className="space-y-2">
            {dashboard.productos_bajo_stock.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: p.stock <= 2 ? '#fef2f2' : '#fef3c7' }}>
                <span className="font-medium text-sm">{p.nombre}</span>
                <span className="font-bold text-sm px-3 py-1 rounded-full"
                  style={{ background: p.stock <= 2 ? '#dc3545' : '#f59e0b', color: 'white' }}>
                  {p.stock} unid.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
