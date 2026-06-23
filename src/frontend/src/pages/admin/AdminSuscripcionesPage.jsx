import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Coffee, Sandwich, CheckCheck, ChefHat, Check } from 'lucide-react';

export default function AdminSuscripcionesPage() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuscripciones();
  }, []);

  const fetchSuscripciones = async () => {
    try {
      const res = await api.get('/suscripciones/admin/dia');
      // Simulamos estado "listo" localmente para la UI si es necesario, 
      // aunque en una iteración futura esto crearía pedidos reales
      setSuscripciones(res.data.map(s => ({ ...s, estado_hoy: 'pendiente' })));
    } catch (err) {
      toast.error('Error al cargar suscripciones del día');
    } finally {
      setLoading(false);
    }
  };

  const marcarListo = (id) => {
    setSuscripciones(prev => prev.map(s => s.id === id ? { ...s, estado_hoy: 'listo' } : s));
    toast.success('Combo marcado como listo');
  };

  const marcarTodos = () => {
    setSuscripciones(prev => prev.map(s => ({ ...s, estado_hoy: 'listo' })));
    toast.success('Todos los combos listos');
  };

  if (loading) return <div className="p-6"><div className="skeleton h-64 rounded-2xl"></div></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#3e1f00]">Combos de Hoy</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', month: 'short', day: 'numeric' })} 
            {' • '}
            <span className="text-orange-500">{suscripciones.length} Confirmados</span>
          </p>
        </div>
        
        {suscripciones.some(s => s.estado_hoy === 'pendiente') && (
          <button 
            onClick={marcarTodos}
            className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 hover:bg-green-600 transition"
          >
            <CheckCheck className="w-4 h-4" /> Marcar todos listos
          </button>
        )}
      </div>

      {suscripciones.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No hay suscripciones activas para hoy</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suscripciones.map(sub => {
            const isListo = sub.estado_hoy === 'listo';
            return (
              <div key={sub.id} className={`bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${isListo ? 'opacity-70' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg font-display shrink-0 ${isListo ? 'bg-gray-100 text-gray-500' : 'bg-orange-50 text-orange-500'}`}>
                    {sub.user.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{sub.user.nombre}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                      {sub.bebida && (
                        <span className="flex items-center gap-1">
                          <Coffee className="w-4 h-4 text-orange-400" /> {sub.bebida.nombre}
                        </span>
                      )}
                      {sub.bebida && sub.snack && <span className="text-gray-300 hidden md:inline">|</span>}
                      {sub.snack && (
                        <span className="flex items-center gap-1">
                          <Sandwich className="w-4 h-4 text-orange-400" /> {sub.snack.nombre}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  {isListo ? (
                    <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3 h-3" /> Listo
                    </span>
                  ) : (
                    <>
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        Por Preparar
                      </span>
                      <button 
                        onClick={() => marcarListo(sub.id)}
                        className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition"
                        title="Marcar como preparado"
                      >
                        <ChefHat className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
