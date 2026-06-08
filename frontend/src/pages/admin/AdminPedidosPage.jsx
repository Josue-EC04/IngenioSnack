import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { connectSocket } from '../../services/socket';
import toast from 'react-hot-toast';
import { RefreshCw, ChevronDown, Clock, ChefHat, CheckCircle, Package, Sandwich, Coffee, Cookie, BoxSelect, AlertCircle, Undo2, Gift } from 'lucide-react';

const ESTADOS = ['todos', 'recibido', 'preparando', 'listo', 'entregado'];
const SIGUIENTE_ESTADO = {
  recibido: { label: 'En Preparación', next: 'preparando', color: '#3b82f6' },
  preparando: { label: 'Marcar Listo', next: 'listo', color: '#22c55e' },
  listo: { label: 'Entregar', next: 'entregado', color: '#6b7280' },
};

// Estado anterior para retroceder
const ESTADO_ANTERIOR = {
  preparando: { label: 'Volver a Recibido', prev: 'recibido' },
  listo:      { label: 'Volver a Preparando', prev: 'preparando' },
  entregado:  { label: 'Revertir Entrega', prev: 'listo' },
};

const ESTADO_LABELS = {
  recibido:   { label: 'Recibido',           class: 'badge-recibido', icon: Clock },
  preparando: { label: 'En preparación',    class: 'badge-preparando', icon: ChefHat },
  listo:      { label: 'Listo',               class: 'badge-listo', icon: CheckCircle },
  entregado:  { label: 'Entregado',           class: 'badge-entregado', icon: Package },
};

function PedidoCard({ pedido, onCambiarEstado, loading }) {
  const sig = SIGUIENTE_ESTADO[pedido.estado];
  const ant = ESTADO_ANTERIOR[pedido.estado];

  return (
    <div className={`order-card ${pedido.estado} animate-fade-in-up`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
              {pedido.numero_pedido}
            </span>
            <span className={`badge flex items-center gap-1 ${ESTADO_LABELS[pedido.estado]?.class}`}>
              {ESTADO_LABELS[pedido.estado]?.icon && (() => {
                const Icon = ESTADO_LABELS[pedido.estado].icon;
                return <Icon size={12} />;
              })()}
              {ESTADO_LABELS[pedido.estado]?.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">
            {pedido.user?.nombre}
            {pedido.user?.codigo_estudiante && ` · Cód: ${pedido.user.codigo_estudiante}`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold" style={{ color: '#ff6b35', fontFamily: 'var(--font-display)' }}>
            S/ {pedido.total.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(pedido.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Lima' })}
          </p>
        </div>
      </div>

      {/* Indicador de cupón canjeado */}
      {pedido.codigo_cupon && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
          style={{ background: '#fff9d0', border: '1px solid #fbbf24' }}>
          <Gift size={14} className="text-amber-500 flex-shrink-0" />
          <span className="text-xs font-semibold text-amber-800">
            Cupón Canjeado: <code className="font-mono">{pedido.codigo_cupon}</code>
          </span>
        </div>
      )}

      {/* Productos */}
      <div className="glass rounded-2xl p-4 mb-3">
        {pedido.detalles?.map((det) => (
          <div key={det.id} className="flex justify-between text-sm">
            <span className={`flex items-center gap-1 ${det.precio_unitario === 0 ? 'text-amber-700 font-semibold' : 'text-gray-700'}`}>
              {det.precio_unitario === 0
                ? <Gift size={14} className="text-amber-500" />
                : det.producto.categoria === 'sandwiches'
                  ? <Sandwich size={14} className="text-orange-500" />
                  : det.producto.categoria === 'bebidas'
                    ? <Coffee size={14} className="text-blue-500" />
                    : <Cookie size={14} className="text-green-500" />}{' '}
              {det.producto.nombre} × {det.cantidad}
              {det.precio_unitario === 0 && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1">Gratis</span>
              )}
            </span>
            <span className={det.precio_unitario === 0 ? 'text-green-600 font-semibold' : 'text-gray-500'}>
              {det.precio_unitario === 0 ? 'S/ 0.00' : `S/ ${det.subtotal.toFixed(2)}`}
            </span>
          </div>
        ))}
      </div>

      {/* Botones de estado */}
      <div className={`flex gap-2 ${sig && ant ? 'flex-row' : ''}`}>
        {/* Botón retroceder */}
        {ant && (
          <button
            id={`pedido-${pedido.id}-anterior`}
            onClick={() => onCambiarEstado(pedido.id, ant.prev)}
            disabled={loading}
            title={ant.label}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-50 active:scale-95 flex-shrink-0"
            style={{ borderColor: '#e5e0d9', color: '#6b5c50', background: 'white' }}
          >
            <Undo2 size={16} />
          </button>
        )}
        {/* Botón avanzar */}
        {sig && (
          <button
            id={`pedido-${pedido.id}-siguiente`}
            onClick={() => onCambiarEstado(pedido.id, sig.next)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: sig.color }}
          >
            {loading ? 'Actualizando...' : sig.label}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [actualizandoId, setActualizandoId] = useState(null);

  const fetchPedidos = useCallback(async () => {
    try {
      const params = {};
      if (filtro !== 'todos') params.estado = filtro;
      const res = await api.get('/pedidos', { params });
      setPedidos(res.data);
    } catch (err) {
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    fetchPedidos();

    // Socket.io
    const socket = connectSocket(null, true);
    socket.on('nuevo_pedido', (pedido) => {
      toast.success(`Nuevo pedido ${pedido.numero_pedido}`, { duration: 4000, icon: '🔔' });
      fetchPedidos();
    });
    socket.on('pedido_actualizado', () => fetchPedidos());

    // Polling cada 10s
    const poll = setInterval(fetchPedidos, 10000);
    return () => {
      socket.off('nuevo_pedido');
      socket.off('pedido_actualizado');
      clearInterval(poll);
    };
  }, [fetchPedidos]);

  const handleCambiarEstado = async (pedidoId, nuevoEstado) => {
    setActualizandoId(pedidoId);
    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
      toast.success(`Estado actualizado: ${ESTADO_LABELS[nuevoEstado]?.label}`);
      fetchPedidos();
    } catch (err) {
      toast.error('Error al actualizar estado');
    } finally {
      setActualizandoId(null);
    }
  };

  const pedidosFiltrados = filtro === 'todos'
    ? pedidos
    : pedidos.filter((p) => p.estado === filtro);

  const pendientesCount = pedidos.filter((p) => p.estado !== 'entregado').length;

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
            Pedidos en Vivo
          </h1>
          {pendientesCount > 0 && (
            <p className="text-sm text-orange-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertCircle size={14} /> {pendientesCount} pedido(s) pendiente(s)
            </p>
          )}
        </div>
        <button id="pedidos-refresh" onClick={fetchPedidos}
          className="p-2.5 rounded-xl transition-all hover:rotate-180"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <RefreshCw size={18} style={{ color: '#ff6b35' }} />
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {ESTADOS.map((e) => (
          <button
            key={e}
            id={`filtro-${e}`}
            onClick={() => setFiltro(e)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={
              filtro === e
                ? { background: '#3e1f00', color: 'white' }
                : { background: 'white', color: '#6b5c50', border: '1px solid #e5e0d9' }
            }
          >
            {e === 'todos' ? 'Todos' : ESTADO_LABELS[e]?.label}
            {e !== 'todos' && e !== 'entregado' && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full"
                style={{ background: 'rgba(255,107,53,0.15)', color: '#ff6b35' }}>
                {pedidos.filter((p) => p.estado === e).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de pedidos */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-3 text-gray-300">
            <BoxSelect size={48} strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 font-medium">
            {filtro === 'todos' ? 'No hay pedidos hoy' : `No hay pedidos ${ESTADO_LABELS[filtro]?.label}`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map((pedido, i) => (
            <div key={pedido.id} style={{ animationDelay: `${i * 0.04}s` }}>
              <PedidoCard
                pedido={pedido}
                onCambiarEstado={handleCambiarEstado}
                loading={actualizandoId === pedido.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
