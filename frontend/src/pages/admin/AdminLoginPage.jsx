import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, Eye, EyeOff, Coffee, Crown } from 'lucide-react';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.correo, form.password);
      if (data.user.rol !== 'admin') {
        toast.error('Esta cuenta no tiene permisos de administrador');
        return;
      }
      toast.success('¡Bienvenido al panel admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1a0d00 0%, #3e1f00 60%, #5c2f00 100%)' }}>
      
      <div className="animate-fade-in-up mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
          style={{ background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.3)' }}>
          <Shield size={40} color="#ff6b35" />
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Panel Admin
        </h1>
        <p className="text-orange-300 mt-1 text-sm flex items-center justify-center gap-2">
          <Coffee size={14} /> IngenioSnack — UNCP
        </p>
      </div>

      <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Acceso Administrador
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <input
                id="admin-login-email"
                type="email"
                className="input-field"
                placeholder="julio@ingeniosnack.pe"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  id="admin-login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button id="admin-login-submit" type="submit" className="btn-cafe w-full justify-center" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield size={18} />
                  Ingresar al Panel
                </span>
              )}
            </button>
          </form>

          <div className="mt-4 p-3 rounded-xl text-xs text-gray-500 bg-amber-50 border border-amber-100">
            <p className="font-semibold text-amber-800 mb-1 flex items-center gap-1"><Crown size={16} /> Demo Admin:</p>
            <p>julio@ingeniosnack.pe / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
