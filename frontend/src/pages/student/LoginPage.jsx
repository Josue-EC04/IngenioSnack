import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Coffee, Eye, EyeOff, LogIn, Lock, GraduationCap } from 'lucide-react';

export default function LoginPage() {
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
      toast.success(`¡Bienvenido, ${data.user.nombre}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #3e1f00 0%, #7a3f00 50%, #ff6b35 100%)' }}>
      
      {/* Logo */}
      <div className="animate-fade-in-up mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          <Coffee size={40} color="white" />
        </div>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          IngenioSnack
        </h1>
        <p className="text-orange-200 mt-1 text-sm">Cafetería Digital — UNCP</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="tu.correo@uncp.edu.pe"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={18} />
                  Ingresar
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold" style={{ color: '#ff6b35' }}>
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-xl text-xs text-gray-500 bg-amber-50 border border-amber-100">
            <p className="font-semibold text-amber-800 mb-1 flex items-center gap-1"><GraduationCap size={16} /> Demo Estudiante:</p>
            <p>ana.garcia@uncp.edu.pe / estudiante123</p>
          </div>
        </div>
      </div>

      {/* Link admin */}
      <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Link to="/admin/login" className="text-orange-200 text-sm hover:text-white transition-colors flex items-center justify-center gap-1">
          <Lock size={14} /> Acceso Administrador
        </Link>
      </div>
    </div>
  );
}
