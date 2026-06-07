import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Search, Gift, CheckCircle, Info, Coffee, Star, Ticket, Sandwich } from 'lucide-react';

export default function AdminFidelidadPage() {
  const [codigo, setCodigo] = useState('');
  const [cupon, setCupon] = useState(null);
  const [searching, setSearching] = useState(false);
  const [canjeando, setCanjeando] = useState(false);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    setSearching(true);
    setCupon(null);
    try {
      const res = await api.get(`/fidelidad/buscar-cupon/${codigo.trim().toUpperCase()}`);
      setCupon(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Cupón no encontrado');
    } finally {
      setSearching(false);
    }
  };

  const handleCanjear = async () => {
    if (!cupon) return;
    setCanjeando(true);
    try {
      await api.patch(`/fidelidad/cupones/${cupon.codigo}/canjear`);
      toast.success(`Cupón ${cupon.codigo} canjeado exitosamente!`);
      setCupon({ ...cupon, canjeado: true, fecha_canje: new Date().toISOString() });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al canjear cupón');
    } finally {
      setCanjeando(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Sistema de Fidelización
        </h1>
        <p className="text-gray-500 text-sm mt-1">Valida y canjea cupones de café americano gratis</p>
      </div>

      {/* Buscador de cupón */}
      <div className="glass rounded-2xl p-5 mb-6">
        <h3 className="font-bold text-gray-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Buscar Cupón
        </h3>
        <form onSubmit={handleBuscar} className="flex gap-3">
          <input
            id="cupon-input"
            type="text"
            className="input-field flex-1 font-mono uppercase"
            placeholder="CAFE-2024-XK7AB..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          />
          <button id="cupon-buscar" type="submit" className="btn-cafe flex-shrink-0" disabled={searching}>
            {searching ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </button>
        </form>
      </div>

      {/* Resultado del cupón */}
      {cupon && (
        <div className={`animate-bounce-in bg-white rounded-2xl p-5 shadow-sm border-2 ${cupon.canjeado ? 'border-gray-200' : 'border-amber-400'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: cupon.canjeado ? '#f3f4f6' : '#fff9d0' }}>
              <Gift size={24} style={{ color: cupon.canjeado ? '#9ca3af' : '#ffd700' }} />
            </div>
            <div>
              <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                Café Americano Gratis
              </p>
              <code className="text-sm font-mono text-gray-600">{cupon.codigo}</code>
            </div>
            <span className={`badge ml-auto ${cupon.canjeado ? 'badge-entregado' : 'badge-listo'}`}>
              {cupon.canjeado ? 'Canjeado' : 'Válido'}
            </span>
          </div>

          <div className="p-3 rounded-xl mb-4" style={{ background: '#f9f4ee' }}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Estudiante:</span>
              <span className="font-semibold">{cupon.user?.nombre}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Correo:</span>
              <span className="font-semibold text-xs">{cupon.user?.correo}</span>
            </div>
            {cupon.user?.codigo_estudiante && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Código:</span>
                <span className="font-semibold">{cupon.user.codigo_estudiante}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Generado:</span>
              <span className="font-semibold">
                {new Date(cupon.fecha_generacion).toLocaleDateString('es-PE', { timeZone: 'America/Lima' })}
              </span>
            </div>
            {cupon.canjeado && cupon.fecha_canje && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Canjeado:</span>
                <span className="font-semibold text-green-600">
                  {new Date(cupon.fecha_canje).toLocaleDateString('es-PE', { timeZone: 'America/Lima' })}
                </span>
              </div>
            )}
          </div>

          {!cupon.canjeado ? (
            <button
              id="cupon-canjear"
              onClick={handleCanjear}
              disabled={canjeando}
              className="btn-primary w-full justify-center"
            >
              {canjeando ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Canjeando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle size={18} />
                  Canjear Cupón (Dar café gratis)
                </span>
              )}
            </button>
          ) : (
            <div className="text-center p-3 rounded-xl bg-gray-100">
              <p className="text-gray-500 font-medium text-sm">Este cupón ya fue utilizado</p>
            </div>
          )}
        </div>
      )}

      {/* Explicación del sistema */}
      <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-100">
        <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
          <Info size={18} /> Cómo funciona el Café de la Lealtad
        </h3>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-center gap-2"><Sandwich size={16} /> Cada sándwich comprado y entregado → <strong>1 punto</strong></li>
          <li className="flex items-center gap-2"><Star size={16} /> Al acumular <strong>10 puntos</strong> → 1 Cupón de Café Americano gratis</li>
          <li className="flex items-center gap-2"><Ticket size={16} /> El estudiante presenta el código en caja</li>
          <li className="flex items-center gap-2"><CheckCircle size={16} /> El administrador busca el código y presiona "Canjear"</li>
          <li className="flex items-center gap-2"><Coffee size={16} /> ¡Entrega el café gratis al estudiante!</li>
        </ul>
      </div>
    </div>
  );
}
