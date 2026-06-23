import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Coffee, Sandwich, Save, CalendarDays, Bell } from 'lucide-react';

const DIAS = [
  { val: '1', label: 'L' },
  { val: '2', label: 'M' },
  { val: '3', label: 'X' },
  { val: '4', label: 'J' },
  { val: '5', label: 'V' }
];

export default function MiComboPage() {
  const [productos, setProductos] = useState({ bebidas: [], snacks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  const [form, setForm] = useState({
    bebida_id: '',
    snack_id: '',
    dias_activos: ['1', '2', '3', '4', '5'],
    activa: true
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
    checkPushStatus();
  }, []);

  useEffect(() => {
    // Calcular total
    let t = 0;
    if (form.bebida_id) {
      const b = productos.bebidas.find(x => x.id.toString() === form.bebida_id.toString());
      if (b) t += b.precio;
    }
    if (form.snack_id) {
      const s = productos.snacks.find(x => x.id.toString() === form.snack_id.toString());
      if (s) t += s.precio;
    }
    setTotal(t);
  }, [form.bebida_id, form.snack_id, productos]);

  const fetchData = async () => {
    try {
      const [prodRes, subRes] = await Promise.all([
        api.get('/productos'),
        api.get('/suscripciones').catch(() => null)
      ]);

      const bebidas = prodRes.data.filter(p => p.categoria === 'bebidas');
      const snacks = prodRes.data.filter(p => p.categoria === 'sandwiches' || p.categoria === 'snacks');
      setProductos({ bebidas, snacks });

      if (subRes && subRes.data) {
        setForm({
          bebida_id: subRes.data.bebida_id || '',
          snack_id: subRes.data.snack_id || '',
          dias_activos: subRes.data.dias_activos.split(','),
          activa: subRes.data.activa
        });
      }
    } catch (err) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const toggleDia = (val) => {
    setForm(prev => {
      const dias = prev.dias_activos.includes(val)
        ? prev.dias_activos.filter(d => d !== val)
        : [...prev.dias_activos, val];
      return { ...prev, dias_activos: dias };
    });
  };

  const checkPushStatus = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        setPushEnabled(!!sub);
      }
    }
  };

  const enablePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return toast.error('Tu navegador no soporta notificaciones push');
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return toast.error('Permiso de notificaciones denegado');
      }

      const registration = await navigator.serviceWorker.ready;
      
      const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!VAPID_KEY) throw new Error('No VAPID key');

      // Base64 to Uint8Array
      const padding = '='.repeat((4 - VAPID_KEY.length % 4) % 4);
      const base64 = (VAPID_KEY + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: outputArray
      });

      await api.post('/suscripciones/web-push', subscription);
      setPushEnabled(true);
      toast.success('¡Notificaciones activadas!');
    } catch (err) {
      console.error(err);
      toast.error('Error al activar notificaciones');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bebida_id && !form.snack_id) {
      return toast.error('Debes seleccionar al menos un producto');
    }
    if (form.dias_activos.length === 0) {
      return toast.error('Debes seleccionar al menos un día');
    }

    setSaving(true);
    try {
      await api.post('/suscripciones', {
        bebida_id: form.bebida_id ? parseInt(form.bebida_id) : null,
        snack_id: form.snack_id ? parseInt(form.snack_id) : null,
        dias_activos: form.dias_activos.join(','),
        activa: form.activa
      });
      toast.success('Combo guardado exitosamente');
      
      if (!pushEnabled) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Activa las notificaciones</p>
              <p className="mt-1 text-sm text-gray-500">Para recibir el recordatorio a las 7:00 AM</p>
            </div>
            <button onClick={() => { toast.dismiss(t.id); enablePushNotifications(); }} className="btn-primary text-sm px-3 py-1 ml-4">Activar</button>
          </div>
        ), { duration: 10000 });
      }

    } catch (err) {
      toast.error('Error al guardar combo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 md:p-6"><div className="skeleton h-64 rounded-3xl"></div></div>;

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Mi Combo Favorito
        </h1>
        <p className="text-gray-500 text-sm mt-1">Tu desayuno listo todos los días sin hacer fila.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Bebidas */}
        <div className="glass rounded-3xl p-5">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <Coffee className="text-orange-500 w-5 h-5" /> Elige tu Bebida
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl border-2 transition-colors cursor-pointer hover:bg-orange-50/50 border-transparent">
              <span className="font-medium text-gray-600">Ninguna</span>
              <input type="radio" name="bebida" value="" checked={!form.bebida_id} onChange={() => setForm({ ...form, bebida_id: '' })} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300" />
            </label>
            {productos.bebidas.map(b => (
              <label key={b.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-colors cursor-pointer ${form.bebida_id == b.id ? 'border-orange-500 bg-orange-50' : 'border-transparent hover:bg-orange-50/50'}`}>
                <span className={`font-medium ${form.bebida_id == b.id ? 'text-gray-900' : 'text-gray-600'}`}>{b.nombre} <span className="text-sm text-orange-500 font-bold ml-1">S/{b.precio.toFixed(2)}</span></span>
                <input type="radio" name="bebida" value={b.id} checked={form.bebida_id == b.id} onChange={(e) => setForm({ ...form, bebida_id: e.target.value })} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300" />
              </label>
            ))}
          </div>
        </div>

        {/* Snacks */}
        <div className="glass rounded-3xl p-5">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800">
            <Sandwich className="text-orange-500 w-5 h-5" /> Elige tu Sándwich o Snack
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-2xl border-2 transition-colors cursor-pointer hover:bg-orange-50/50 border-transparent">
              <span className="font-medium text-gray-600">Ninguno</span>
              <input type="radio" name="snack" value="" checked={!form.snack_id} onChange={() => setForm({ ...form, snack_id: '' })} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300" />
            </label>
            {productos.snacks.map(s => (
              <label key={s.id} className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-colors cursor-pointer ${form.snack_id == s.id ? 'border-orange-500 bg-orange-50' : 'border-transparent hover:bg-orange-50/50'}`}>
                <span className={`font-medium ${form.snack_id == s.id ? 'text-gray-900' : 'text-gray-600'}`}>{s.nombre} <span className="text-sm text-orange-500 font-bold ml-1">S/{s.precio.toFixed(2)}</span></span>
                <input type="radio" name="snack" value={s.id} checked={form.snack_id == s.id} onChange={(e) => setForm({ ...form, snack_id: e.target.value })} className="w-5 h-5 text-orange-500 focus:ring-orange-500 border-gray-300" />
              </label>
            ))}
          </div>
        </div>

        {/* Días Activos */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2 text-gray-800">
              <CalendarDays className="text-orange-500 w-5 h-5" /> Días Activos
            </h3>
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input type="checkbox" checked={form.activa} onChange={(e) => setForm({ ...form, activa: e.target.checked })} className="rounded text-orange-500 focus:ring-orange-500" />
              Suscripción {form.activa ? 'Activa' : 'Pausada'}
            </label>
          </div>
          <div className="flex justify-between mt-2">
            {DIAS.map(d => {
              const isSelected = form.dias_activos.includes(d.val);
              return (
                <button key={d.val} type="button" onClick={() => toggleDia(d.val)}
                  className={`w-11 h-11 rounded-2xl font-bold transition-all ${isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white text-gray-400 border border-gray-200'}`}>
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-40 md:relative md:bottom-0 md:bg-transparent md:border-0 md:shadow-none md:p-0">
          <div className="max-w-lg mx-auto">
            <div className="flex justify-between items-end mb-4 px-2 md:px-0">
              <span className="text-gray-500 font-medium">Total diario</span>
              <span className="text-2xl font-bold font-display text-orange-500">S/ {total.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn-primary w-full text-lg justify-center shadow-orange-500/30" disabled={saving || total === 0}>
              {saving ? 'Guardando...' : <><Save size={20} /> Guardar mi Combo</>}
            </button>
            
            {!pushEnabled && (
              <button type="button" onClick={enablePushNotifications} className="mt-3 w-full text-sm font-medium text-gray-500 flex justify-center items-center gap-2 hover:text-orange-500 transition">
                <Bell size={16} /> Activar notificaciones matutinas
              </button>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
