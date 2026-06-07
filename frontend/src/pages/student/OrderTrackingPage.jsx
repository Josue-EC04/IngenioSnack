import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { connectSocket } from '../../services/socket';
import toast from 'react-hot-toast';
import { ArrowLeft, Package, CheckCircle, Clock, ChefHat, Sandwich, Coffee, Cookie, Frown, PartyPopper, Wallet } from 'lucide-react';

const ESTADOS = [
  { key: 'recibido',   icon: Clock,       label: 'Recibido',            desc: 'Tu pedido fue recibido' },
  { key: 'preparando', icon: ChefHat,     label: 'En preparación',     desc: 'Estamos preparando tu pedido' },
  { key: 'listo',      icon: CheckCircle, label: 'Listo para recoger',  desc: 'Pasa a recogerlo en caja' },
  { key: 'entregado',  icon: Package,     label: 'Entregado',            desc: 'Pedido entregado' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedido = useCallback(async () => {
    try {
      const res = await api.get(`/pedidos/${id}`);
      setPedido(res.data);
    } catch (err) {
      setError('Pedido no encontrado');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPedido();

    // Socket.io para tiempo real
    const socket = connectSocket(user?.id);
    socket.on('mi_pedido_actualizado', (pedidoActualizado) => {
      if (pedidoActualizado.id === parseInt(id)) {
        setPedido(pedidoActualizado);
        if (pedidoActualizado.estado === 'listo') {
          toast.success('¡Tu pedido está listo para recoger!', { duration: 6000, icon: '🎉' });
        }
      }
    });

    // Polling cada 10 segundos como fallback
    const poll = setInterval(fetchPedido, 10000);

    return () => {
      socket.off('mi_pedido_actualizado');
      clearInterval(poll);
    };
  }, [id, user?.id, fetchPedido]);

  if (loading) {
    return (
      <div className="page-content flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }} />
          <p className="text-gray-500">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !pedido) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-screen px-4 pb-24">
        <div className="flex justify-center mb-4 text-gray-400">
          <Frown size={48} strokeWidth={1.5} />
        </div>
        <p className="text-gray-700 font-semibold mb-4">{error || 'Pedido no encontrado'}</p>
        <button onClick={() => navigate('/')} className="btn-primary">Ir al inicio</button>
      </div>
    );
  }

  const estadoActualIndex = ESTADOS.findIndex((e) => e.key === pedido.estado);

  return (
    <div className="page-content px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
        <button id="tracking-back" onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <ArrowLeft size={20} style={{ color: '#3e1f00' }} />
        </button>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
            {pedido.numero_pedido}
          </h1>
          <p className="text-gray-500 text-xs">
            {new Date(pedido.created_at).toLocaleString('es-PE', { timeZone: 'America/Lima' })}
          </p>
        </div>
      </div>

      {/* Estado destacado */}
      {pedido.estado === 'listo' && (
        <div className="animate-bounce-in mb-6 p-4 rounded-2xl text-center"
          style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}>
          <div className="flex justify-center mb-2">
            <PartyPopper size={36} color="white" />
          </div>
          <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
            ¡Tu pedido está listo!
          </p>
          <p className="text-green-100 text-sm mt-1">Pasa a la caja a recogerlo y pagar</p>
        </div>
      )}

      {/* Timeline de estados */}
      <div className="bg-white rounded-2xl p-5 mb-4 animate-fade-in-up shadow-sm" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-bold text-gray-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Estado del Pedido
        </h3>
        <div className="space-y-2">
          {ESTADOS.map((estado, i) => {
            const isCompleted = i < estadoActualIndex;
            const isCurrent = i === estadoActualIndex;
            const isPending = i > estadoActualIndex;

            return (
              <div key={estado.key}>
                <div className="order-step">
                  <div className={`order-step-icon ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}>
                    <estado.icon size={20} className={isCurrent ? 'text-white' : isCompleted ? 'text-green-700' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${isPending ? 'text-gray-400' : 'text-gray-800'}`}
                      style={isCurrent ? { fontFamily: 'var(--font-display)', color: '#ff6b35' } : {}}>
                      {estado.label}
                    </p>
                    <p className={`text-xs ${isPending ? 'text-gray-300' : 'text-gray-500'}`}>
                      {isCurrent ? <strong style={{ color: '#ff6b35' }}>{estado.desc}</strong> : estado.desc}
                    </p>
                  </div>
                  {isCompleted && <CheckCircle size={18} color="#22c55e" />}
                </div>
                {i < ESTADOS.length - 1 && (
                  <div className={`order-step-line ${isCompleted ? 'completed' : 'pending'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detalle del pedido */}
      <div className="bg-white rounded-2xl p-4 mb-4 animate-fade-in-up shadow-sm" style={{ animationDelay: '0.15s' }}>
        <h3 className="font-bold text-gray-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          Productos Pedidos
        </h3>
        <div className="space-y-2">
          {pedido.detalles?.map((det) => (
            <div key={det.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>{det.producto.categoria === 'sandwiches' ? <Sandwich size={16} className="text-orange-500"/> : det.producto.categoria === 'bebidas' ? <Coffee size={16} className="text-blue-500"/> : <Cookie size={16} className="text-green-500"/>}</span>
                <span className="text-gray-700">{det.producto.nombre}</span>
                <span className="text-gray-400">× {det.cantidad}</span>
              </div>
              <span className="font-semibold" style={{ color: '#3e1f00' }}>S/ {det.subtotal.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-2 mt-2 flex justify-between font-bold">
            <span style={{ color: '#3e1f00', fontFamily: 'var(--font-display)' }}>Total</span>
            <span style={{ color: '#ff6b35', fontFamily: 'var(--font-display)' }}>S/ {pedido.total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
            <Wallet size={12} /> Pago contra entrega en caja
          </p>
        </div>
      </div>

      {/* Botón ir al inicio */}
      <button id="tracking-inicio" onClick={() => navigate('/')} className="btn-secondary w-full justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        Ir al Inicio
      </button>
    </div>
  );
}
