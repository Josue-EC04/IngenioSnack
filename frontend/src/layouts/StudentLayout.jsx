import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Home, UtensilsCrossed, ShoppingCart, User, Coffee } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', icon: Home, exact: true },
  { to: '/menu', label: 'Menú', icon: UtensilsCrossed },
  { to: '/carrito', label: 'Carrito', icon: ShoppingCart, showBadge: true },
  { to: '/perfil', label: 'Perfil', icon: User },
];

export default function StudentLayout() {
  const { cantidadTotal } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="max-w-5xl mx-auto relative min-h-screen md:shadow-2xl md:border-x border-white/50" style={{ background: 'transparent' }}>
      {/* App Header */}
      <header className="glass sticky top-0 z-50 flex items-center justify-between px-4 py-3 mb-4 shadow-sm border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff8c35] flex items-center justify-center shadow-md shadow-orange-500/20">
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>I</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight" style={{ color: '#3e1f00', fontFamily: 'var(--font-display)' }}>IngenioSnack</h1>
            <p className="text-xs font-medium text-orange-500">Cafetería UNCP</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {user?.nombre?.split(' ')[0]}
        </div>
      </header>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
                {item.showBadge && cantidadTotal > 0 && (
                  <div className="cart-badge">{cantidadTotal > 9 ? '9+' : cantidadTotal}</div>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
