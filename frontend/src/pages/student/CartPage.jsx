import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingCart, ChevronRight, CheckCircle, Sandwich, Coffee, Cookie, Frown, Wallet } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateCantidad, clearCart, total, removeItems } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirmar = async () => {
    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
      };
      const res = await api.post('/pedidos', payload);
      clearCart();
      toast.success(`✅ ${res.data.message}`, { duration: 5000 });
      navigate(`/pedido/${res.data.pedido.id}`);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.productos_agotados) {
        const ids = errorData.productos_agotados.map((p) => p.producto_id);
        removeItems(ids);
        const nombres = errorData.productos_agotados.map((p) => p.nombre).join(', ');
        toast.error(`Lo sentimos, ${nombres} ya no está disponible. Ha sido removido de tu carrito.`, {
          duration: 5000,
        });
      } else {
        toast.error(errorData?.error || 'Error al confirmar el pedido');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-screen px-4 pb-24">
        <div className="flex justify-center mb-4 text-gray-300">
          <ShoppingCart size={64} strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Tu carrito está vacío
        </h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Agrega productos del menú para realizar tu pedido
        </p>
        <button id="cart-ir-menu" onClick={() => navigate('/menu')} className="btn-primary">
          Ver Menú
        </button>
      </div>
    );
  }

  return (
    <div className="page-content px-4 pt-4 pb-32">
      <div className="animate-fade-in-up mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Mi Carrito
        </h1>
        <p className="text-gray-500 text-sm">{items.length} producto(s) seleccionado(s)</p>
      </div>

      {/* Lista de items */}
      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <div
            key={item.producto_id}
            className="bg-white rounded-2xl p-4 shadow-sm animate-fade-in-up flex items-center gap-3"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {/* Emoji */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#fff3e6' }}>
              {item.categoria === 'sandwiches' ? <Sandwich size={24} className="text-orange-500" /> : item.categoria === 'bebidas' ? <Coffee size={24} className="text-blue-500" /> : <Cookie size={24} className="text-green-500" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">{item.nombre}</p>
              <p className="text-xs text-gray-500">S/ {item.precio.toFixed(2)} c/u</p>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                id={`cart-minus-${item.producto_id}`}
                onClick={() => updateCantidad(item.producto_id, item.cantidad - 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#fff3e6', color: '#ff6b35' }}
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm w-5 text-center" style={{ color: '#3e1f00' }}>
                {item.cantidad}
              </span>
              <button
                id={`cart-plus-${item.producto_id}`}
                onClick={() => updateCantidad(item.producto_id, item.cantidad + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: '#ff6b35', color: 'white' }}
              >
                <Plus size={14} />
              </button>
              <button
                id={`cart-remove-${item.producto_id}`}
                onClick={() => removeItem(item.producto_id)}
                className="w-8 h-8 rounded-full flex items-center justify-center ml-1"
                style={{ background: '#fef2f2', color: '#dc3545' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="font-bold text-gray-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>Resumen</h3>
        {items.map((item) => (
          <div key={item.producto_id} className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{item.nombre} × {item.cantidad}</span>
            <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold">
          <span style={{ color: '#3e1f00', fontFamily: 'var(--font-display)' }}>Total</span>
          <span style={{ color: '#ff6b35', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            S/ {total.toFixed(2)}
          </span>
        </div>
        <div className="mt-2 p-2 bg-amber-50 rounded-lg">
          <p className="text-xs text-amber-700 text-center flex items-center justify-center gap-1">
            <Wallet size={14} /> Pago: <strong>Contra entrega en caja</strong>
          </p>
        </div>
      </div>

      {/* Botón confirmar (fijo abajo) */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button
          id="cart-confirmar"
          onClick={handleConfirmar}
          disabled={loading}
          className="btn-primary w-full justify-center text-base py-4 shadow-xl"
          style={{ borderRadius: '16px' }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirmando pedido...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle size={20} />
              Confirmar Pedido · S/ {total.toFixed(2)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
