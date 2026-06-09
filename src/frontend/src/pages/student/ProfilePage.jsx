import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { LogOut, Star, Gift, Clock, ChevronRight, Trophy, Copy, User, Ticket, Lightbulb, ClipboardList, ChefHat, CheckCircle, Package, Coffee } from 'lucide-react';

const ESTADO_PEDIDO = {
  recibido:   { label: 'Recibido', icon: Clock },
  preparando: { label: 'Preparando', icon: ChefHat },
  listo:      { label: 'Listo', icon: CheckCircle },
  entregado:  { label: 'Entregado', icon: Package },
};

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth();
  const [fidelidad, setFidelidad] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('puntos');
  // Usar ref para evitar que refreshUser cambiante dispare el effect
  const refreshUserRef = useRef(refreshUser);
  useEffect(() => { refreshUserRef.current = refreshUser; }, [refreshUser]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fidRes, pedRes] = await Promise.all([
          api.get('/fidelidad/mis-puntos'),
          api.get('/pedidos'),
        ]);
        setFidelidad(fidRes.data);
        setPedidos(pedRes.data);
        await refreshUserRef.current();
      } catch (err) {
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    toast.success('Código copiado al portapapeles 📋');
  };

  if (loading) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const progresoActual = (fidelidad?.progreso_actual || 0);

  return (
    <div className="page-content px-4 pt-4 pb-24">
      {/* Header perfil */}
      <div className="animate-fade-in-up mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
            Mi Perfil
          </h1>
          <button id="profile-logout" onClick={logout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={16} />
            Salir
          </button>
        </div>

        {/* Avatar y datos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #3e1f00, #7a3f00)' }}>
            <User size={32} />
          </div>
          <div>
            <h2 className="font-bold text-gray-800" style={{ fontFamily: 'var(--font-display)' }}>
              {user?.nombre}
            </h2>
            <p className="text-sm text-gray-500">{user?.correo}</p>
            {user?.codigo_estudiante && (
              <p className="text-xs text-gray-400 mt-0.5">Código: {user.codigo_estudiante}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {[
          { key: 'puntos', label: 'Lealtad', icon: Star },
          { key: 'historial', label: 'Mis Pedidos', icon: ClipboardList },
        ].map((tab) => (
          <button
            key={tab.key}
            id={`profile-tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
            style={
              activeTab === tab.key
                ? { background: '#3e1f00', color: 'white' }
                : { background: 'white', color: '#6b5c50', border: '1px solid #e5e0d9' }
            }
          >
            <div className="flex items-center gap-2 justify-center">
              <tab.icon size={16} />
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab: Puntos de fidelidad */}
      {activeTab === 'puntos' && (
        <div className="animate-fade-in-up">
          {/* Barra de progreso */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ffd700, #ff6b35)' }}>
                <Trophy size={24} color="white" />
              </div>
              <div>
                <p className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                  {fidelidad?.puntos_fidelidad || 0} puntos
                </p>
                <p className="text-sm text-gray-500">Café de la Lealtad</p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progreso hacia café gratis</span>
                <span className="font-semibold" style={{ color: '#ff6b35' }}>{progresoActual}/10</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progresoActual * 10}%` }} />
              </div>
            </div>
            <p className="text-sm text-gray-600 flex items-center justify-center gap-2 mt-3">
              <Coffee size={16} className="text-orange-500" />
              <span>Llevas <strong>{progresoActual}/10</strong> sándwiches para tu próximo café gratis</span>
            </p>
          </div>

          {/* Cupones disponibles */}
          <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Mis Cupones</h3>
          {fidelidad?.cupones?.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="flex justify-center mb-2 text-gray-300">
                <Ticket size={48} strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 text-sm">Aún no tienes cupones.</p>
              <p className="text-gray-400 text-xs mt-1">¡Compra 10 sándwiches para ganar tu café gratis!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fidelidad.cupones.map((cupon) => (
                <div key={cupon.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${cupon.canjeado ? 'border-gray-200 opacity-60' : 'border-amber-400'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift size={18} style={{ color: cupon.canjeado ? '#9ca3af' : '#ffd700' }} />
                      <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                        Café Americano Gratis
                      </span>
                    </div>
                    <span className={`badge ${cupon.canjeado ? 'badge-entregado' : 'badge-listo'}`}>
                      {cupon.canjeado ? 'Canjeado' : 'Disponible'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 p-2 rounded-xl"
                    style={{ background: '#fff9d0' }}>
                    <code className="text-sm font-mono font-bold" style={{ color: '#3e1f00' }}>
                      {cupon.codigo}
                    </code>
                    {!cupon.canjeado && (
                      <button
                        id={`cupon-copy-${cupon.id}`}
                        onClick={() => copiarCodigo(cupon.codigo)}
                        className="p-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                        <Copy size={14} style={{ color: '#3e1f00' }} />
                      </button>
                    )}
                  </div>
                  {!cupon.canjeado && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Lightbulb size={14} className="text-amber-500" />
                      Muestra este código en caja para canjear tu café gratis
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Historial de pedidos */}
      {activeTab === 'historial' && (
        <div className="animate-fade-in-up">
          {pedidos.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="flex justify-center mb-2 text-gray-300">
                <ClipboardList size={48} strokeWidth={1.5} />
              </div>
              <p className="text-gray-500 text-sm">Aún no tienes pedidos.</p>
              <p className="text-gray-400 text-xs mt-1">¡Haz tu primer pedido en el menú!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidos.map((pedido, i) => (
                <Link
                  key={pedido.id}
                  to={`/pedido/${pedido.id}`}
                  id={`historial-pedido-${pedido.id}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold" style={{ color: '#3e1f00', fontFamily: 'var(--font-display)' }}>
                        {pedido.numero_pedido}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(pedido.created_at).toLocaleDateString('es-PE', { timeZone: 'America/Lima' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: '#ff6b35' }}>
                          S/ {pedido.total.toFixed(2)}
                        </p>
                        <div className="text-xs flex items-center gap-1 justify-end mt-1" style={{ color: pedido.estado === 'entregado' ? '#22c55e' : pedido.estado === 'listo' ? '#22c55e' : '#f59e0b' }}>
                          {(() => {
                            const est = ESTADO_PEDIDO[pedido.estado];
                            const Icon = est.icon;
                            return (
                              <>
                                <Icon size={12} />
                                {est.label}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
