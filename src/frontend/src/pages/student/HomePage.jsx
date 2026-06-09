import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingBag, Clock, ChevronRight, Coffee, Star, Utensils, Sandwich, Cookie, Bell, CheckCircle } from 'lucide-react';

function EstadoBadge({ estado }) {
  const map = {
    recibido:   { label: 'Recibido',            className: 'badge-recibido', icon: Clock },
    preparando: { label: 'En preparación',     className: 'badge-preparando', icon: Utensils },
    listo:      { label: 'Listo para recoger',  className: 'badge-listo', icon: Bell },
    entregado:  { label: 'Entregado',            className: 'badge-entregado', icon: CheckCircle },
  };
  const info = map[estado] || map.recibido;
  const Icon = info.icon;
  return (
    <span className={`badge ${info.className}`}>
      <Icon size={12} strokeWidth={2.5} />
      {info.label}
    </span>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidoActivo = async () => {
      try {
        const res = await api.get('/pedidos/activo');
        setPedidoActivo(res.data);
      } catch (err) {
        // No hay pedido activo
      } finally {
        setLoading(false);
      }
    };
    fetchPedidoActivo();
  }, []);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? '¡Buenos días' : hora < 18 ? '¡Buenas tardes' : '¡Buenas noches';

  return (
    <div className="page-content px-4 pt-4 pb-24">
      {/* Saludo */}
      <div className="animate-fade-in-up mb-6">
        <p className="text-gray-500 text-sm">{saludo},</p>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          {user?.nombre?.split(' ')[0]} <Coffee size={24} className="text-orange-500" />
        </h1>
      </div>

      {/* Banner hero */}
      <div className="animate-fade-in-up rounded-3xl overflow-hidden mb-6 shadow-2xl" style={{ animationDelay: '0.05s' }}>
        <div className="p-6 relative" style={{ background: 'linear-gradient(135deg, #1f140e 0%, #0a0604 100%)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                <Coffee size={20} /> IngenioSnack
              </h2>
              <p className="text-orange-200 text-sm mt-1">
                Pide antes del recreo y<br />evita la fila
              </p>
            </div>
            <div className="text-orange-200 opacity-80">
              <Sandwich size={48} strokeWidth={1.5} />
            </div>
          </div>
          <button
            id="home-ir-menu"
            onClick={() => navigate('/menu')}
            className="mt-4 btn-primary w-full justify-center"
            style={{ background: '#ff6b35' }}
          >
            Ver Menú
          </button>
        </div>
      </div>

      {/* Pedido activo */}
      {!loading && pedidoActivo && (
        <div className="animate-fade-in-up mb-6" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Mi Pedido Activo</h3>
          <Link
            to={`/pedido/${pedidoActivo.id}`}
            id="home-pedido-activo"
            className="block order-card recibido glass"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                {pedidoActivo.numero_pedido}
              </span>
              <EstadoBadge estado={pedidoActivo.estado} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {pedidoActivo.detalles?.length} producto(s) · S/ {pedidoActivo.total.toFixed(2)}
              </p>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            {pedidoActivo.estado === 'listo' && (
              <div className="mt-3 p-2 bg-green-50 rounded-lg text-sm text-green-700 font-semibold animate-bounce-in flex items-center gap-2">
                <Bell size={16} /> ¡Tu pedido está listo! Pasa a recogerlo.
              </div>
            )}
          </Link>
        </div>
      )}

      {/* Puntos de fidelidad */}
      <div className="animate-fade-in-up mb-6 md:mb-8" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
          <Star size={16} className="text-orange-500" /> Tu Lealtad
        </h3>
        <div className="stat-card glass">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff3e6' }}>
              <Star size={20} style={{ color: '#ffd700' }} fill="#ffd700" />
            </div>
            <div>
              <p className="font-bold" style={{ color: '#3e1f00', fontFamily: 'var(--font-display)' }}>
                {user?.puntos_fidelidad || 0} puntos
              </p>
            <p className="text-xs text-gray-500">
              {(() => {
                const pts = user?.puntos_fidelidad || 0;
                const restantes = pts === 0 ? 10 : pts % 10 === 0 ? 0 : 10 - (pts % 10);
                return `${restantes} sándwich${restantes !== 1 ? 'es' : ''} para tu café gratis`;
              })()}
            </p>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((user?.puntos_fidelidad || 0) % 10) * 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {(() => {
              const pts = user?.puntos_fidelidad || 0;
              const progreso = pts % 10;
              const restantes = pts === 0 ? 10 : progreso === 0 ? 0 : 10 - progreso;
              return `${progreso}/10 sándwiches${restantes === 0 ? ' — ¡Cupón disponible!' : ` · faltan ${restantes}`}`;
            })()}
          </p>
        </div>
      </div>

      {/* Categorías rápidas */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Explorar</h3>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { key: 'sandwiches', label: 'Sándwiches', icon: Sandwich, color: '#fff3e6' },
            { key: 'bebidas', label: 'Bebidas', icon: Coffee, color: '#e6f0ff' },
            { key: 'snacks', label: 'Snacks', icon: Cookie, color: '#f0ffe6' },
          ].map((cat) => (
            <button
              key={cat.key}
              id={`home-cat-${cat.key}`}
              onClick={() => navigate(`/menu?categoria=${cat.key}`)}
              className="p-4 rounded-3xl text-center transition-all hover:scale-105 active:scale-95 glass"
              style={{ background: 'rgba(255,255,255,0.7)' }}
            >
              <div className="flex justify-center mb-2 text-gray-700 opacity-80">
                <cat.icon size={28} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-semibold text-gray-700">{cat.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
