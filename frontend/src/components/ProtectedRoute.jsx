import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-fondo)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: '#ff6b35', borderTopColor: 'transparent' }} />
          <p className="text-gray-500 mt-3 text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Admin no puede acceder a rutas de estudiante
  if (!requireAdmin && user.rol === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to={user.rol === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
}
