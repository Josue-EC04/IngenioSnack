import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trophy, Medal, Star, Coffee, Info, Award } from 'lucide-react';

export default function AdminFidelidadPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await api.get('/fidelidad/ranking');
        setRanking(res.data);
      } catch (err) {
        console.error('Error al obtener ranking:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
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
    <div className="p-4 md:p-6 pb-24">
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          <Award className="text-amber-500" /> Ranking de Fidelidad
        </h1>
        <p className="text-gray-500 text-sm mt-1">Los estudiantes más fieles a IngenioSnack</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-sm mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {ranking.length > 0 ? (
          <div className="space-y-3">
            {ranking.map((user, index) => {
              let badgeColor = '';
              let Icon = Star;
              
              if (index === 0) {
                badgeColor = 'bg-amber-100 text-amber-600 border-amber-300';
                Icon = Trophy;
              } else if (index === 1) {
                badgeColor = 'bg-gray-100 text-gray-500 border-gray-300';
                Icon = Medal;
              } else if (index === 2) {
                badgeColor = 'bg-orange-100 text-orange-700 border-orange-300';
                Icon = Medal;
              } else {
                badgeColor = 'bg-gray-50 text-gray-400 border-transparent';
              }

              return (
                <div key={user.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-transform hover:scale-[1.02] ${badgeColor} ${index > 2 ? 'border-transparent bg-white shadow-sm' : ''}`}>
                  
                  {/* Posición */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${index <= 2 ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                    {index <= 2 ? <Icon size={20} /> : index + 1}
                  </div>

                  {/* Info Usuario */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-lg truncate" style={{ fontFamily: 'var(--font-display)' }}>
                      {user.nombre}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.correo}</p>
                  </div>

                  {/* Puntos */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-black" style={{ color: '#ff6b35', fontFamily: 'var(--font-display)' }}>
                      {user.puntos_fidelidad}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Puntos</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <Coffee size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Aún no hay clientes con puntos acumulados</p>
          </div>
        )}
      </div>

      {/* Info Contextual */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm">
          <Info size={16} /> Nota sobre el sistema
        </h3>
        <p className="text-xs text-blue-700 leading-relaxed">
          El canje de cupones ahora es <strong>automático</strong>. Los estudiantes ganan 1 punto por cada sándwich entregado y reciben automáticamente un cupón por cada 10 puntos. Pueden canjearlo ellos mismos desde su carrito sin necesidad de validación manual.
        </p>
      </div>
    </div>
  );
}
