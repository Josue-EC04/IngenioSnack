import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Páginas estudiante
import LoginPage from './pages/student/LoginPage';
import RegisterPage from './pages/student/RegisterPage';
import HomePage from './pages/student/HomePage';
import MenuPage from './pages/student/MenuPage';
import CartPage from './pages/student/CartPage';
import OrderTrackingPage from './pages/student/OrderTrackingPage';
import ProfilePage from './pages/student/ProfilePage';
import MiComboPage from './pages/student/MiComboPage';

// Páginas admin
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPedidosPage from './pages/admin/AdminPedidosPage';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminReportesPage from './pages/admin/AdminReportesPage';
import AdminFidelidadPage from './pages/admin/AdminFidelidadPage';
import AdminSuscripcionesPage from './pages/admin/AdminSuscripcionesPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(62, 31, 0, 0.15)',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: 'white' },
              },
              error: {
                iconTheme: { primary: '#dc3545', secondary: 'white' },
              },
            }}
          />

          <Routes>
            {/* Rutas públicas (solo si no está logueado) */}
            <Route path="/login" element={
              <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
            } />
            <Route path="/admin/login" element={
              <PublicOnlyRoute><AdminLoginPage /></PublicOnlyRoute>
            } />

            {/* Rutas de estudiante */}
            <Route element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pedido/:id" element={<OrderTrackingPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
              <Route path="/mi-combo" element={<MiComboPage />} />
            </Route>

            {/* Rutas de admin */}
            <Route element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/pedidos" element={<AdminPedidosPage />} />
              <Route path="/admin/menu" element={<AdminMenuPage />} />
              <Route path="/admin/reportes" element={<AdminReportesPage />} />
              <Route path="/admin/fidelidad" element={<AdminFidelidadPage />} />
              <Route path="/admin/suscripciones" element={<AdminSuscripcionesPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
