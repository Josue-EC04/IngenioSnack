import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { connectSocket } from '../services/socket';
import { useEffect } from 'react';
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, BarChart3, Star,
  LogOut, Coffee, Menu, X, Bell, Crown, CalendarDays
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/pedidos', label: 'Pedidos en Vivo', icon: ShoppingBag },
  { to: '/admin/menu', label: 'Gestión Menú', icon: UtensilsCrossed },
  { to: '/admin/suscripciones', label: 'Combos Diarios', icon: CalendarDays },
  { to: '/admin/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/admin/fidelidad', label: 'Fidelización', icon: Star },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendientesCount, setPendientesCount] = useState(0);

  useEffect(() => {
    // Conectar socket para nuevos pedidos
    const socket = connectSocket(user?.id, true);
    socket.on('nuevo_pedido', (pedido) => {
      setPendientesCount((c) => c + 1);
      toast.success(`🆕 Nuevo pedido ${pedido.numero_pedido}`, { duration: 4000 });
    });
    return () => socket.off('nuevo_pedido');
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f9f4ee' }}>
      {/* Overlay móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(255,107,53,0.2)' }}>
              <Coffee size={22} color="#ff6b35" />
            </div>
            <div>
              <p className="font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>IngenioSnack</p>
              <p className="text-orange-300 text-xs">Panel Admin</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="py-4 flex-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                id={`admin-nav-${link.label.toLowerCase().replace(/ /g, '-')}`}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{link.label}</span>
                {link.label === 'Pedidos en Vivo' && pendientesCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs rounded-full font-bold"
                    style={{ background: '#ff6b35', color: 'white' }}>
                    {pendientesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
              style={{ background: 'rgba(255,107,53,0.2)' }}>
              <Crown size={20} className="text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.nombre}</p>
              <p className="text-orange-300 text-xs truncate">{user?.correo}</p>
            </div>
          </div>
          <button id="admin-logout" onClick={handleLogout}
            className="flex items-center gap-2 text-orange-300 hover:text-white transition-colors text-sm w-full px-2 py-1.5 rounded-lg hover:bg-white/10">
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-content flex-1">
        {/* Topbar móvil */}
        <header className="sticky top-0 z-30 px-4 py-3 border-b border-gray-200 md:hidden"
          style={{ background: 'rgba(249, 244, 238, 0.95)', backdropFilter: 'blur(8px)' }}>
          <div className="flex items-center justify-between">
            <button id="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              {sidebarOpen ? <X size={20} style={{ color: '#3e1f00' }} /> : <Menu size={20} style={{ color: '#3e1f00' }} />}
            </button>
            <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
              IngenioSnack Admin
            </span>
            <div className="relative">
              <Bell size={20} style={{ color: '#3e1f00' }} />
              {pendientesCount > 0 && (
                <div className="cart-badge" onClick={() => setPendientesCount(0)}>{pendientesCount}</div>
              )}
            </div>
          </div>
        </header>

        <main className="p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
