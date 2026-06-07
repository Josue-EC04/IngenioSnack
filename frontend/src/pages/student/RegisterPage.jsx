import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Coffee, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', correo: '', codigo_estudiante: '', password: '', confirmPass: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPass) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const data = await register({
        nombre: form.nombre,
        correo: form.correo,
        codigo_estudiante: form.codigo_estudiante || undefined,
        password: form.password,
      });
      toast.success(`¡Bienvenido a IngenioSnack, ${data.user.nombre}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #3e1f00 0%, #7a3f00 50%, #ff6b35 100%)' }}>
      
      <div className="animate-fade-in-up mb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          <Coffee size={32} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>IngenioSnack</h1>
        <p className="text-orange-200 text-sm">Cafetería Digital — UNCP</p>
      </div>

      <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                id="register-nombre"
                type="text"
                className="input-field"
                placeholder="Ana García López"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                id="register-email"
                type="email"
                className="input-field"
                placeholder="tu.correo@uncp.edu.pe"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de estudiante <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                id="register-codigo"
                type="text"
                className="input-field"
                placeholder="2021100123"
                value={form.codigo_estudiante}
                onChange={(e) => setForm({ ...form, codigo_estudiante: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                id="register-confirm-password"
                type="password"
                className="input-field"
                placeholder="Repite tu contraseña"
                value={form.confirmPass}
                onChange={(e) => setForm({ ...form, confirmPass: e.target.value })}
                required
              />
            </div>

            <button id="register-submit" type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={18} />
                  Crear Cuenta
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold" style={{ color: '#ff6b35' }}>
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
