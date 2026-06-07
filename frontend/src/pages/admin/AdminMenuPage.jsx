import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, ToggleLeft, ToggleRight, X, Save, Package, Sandwich, Coffee, Cookie, Utensils } from 'lucide-react';

const CATEGORIAS = [
  { key: 'sandwiches', label: 'Sándwiches', icon: Sandwich },
  { key: 'bebidas', label: 'Bebidas', icon: Coffee },
  { key: 'snacks', label: 'Snacks', icon: Cookie },
];

const initialForm = {
  nombre: '', descripcion: '', precio: '', categoria: 'sandwiches',
  imagen_url: '', stock: '', activo: true,
};

export default function AdminMenuPage() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos', { params: { incluir_inactivos: 'true' } });
      setProductos(res.data);
    } catch (err) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleOpenCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (producto) => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      categoria: producto.categoria,
      imagen_url: producto.imagen_url || '',
      stock: producto.stock.toString(),
      activo: producto.activo,
    });
    setEditingId(producto.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.categoria) {
      toast.error('Nombre, precio y categoría son requeridos');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos', form);
        toast.success('Producto creado');
      }
      setShowModal(false);
      fetchProductos();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar producto');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (producto) => {
    try {
      await api.patch(`/productos/${producto.id}/toggle`);
      toast.success(producto.activo ? 'Producto desactivado' : 'Producto activado');
      fetchProductos();
    } catch (err) {
      toast.error('Error al cambiar estado');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
          Gestión del Menú
        </h1>
        <button id="menu-nuevo-producto" onClick={handleOpenCreate} className="btn-primary">
          <Plus size={18} />
          Nuevo
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {CATEGORIAS.map((cat) => {
            const prods = productos.filter((p) => p.categoria === cat.key);
            if (prods.length === 0) return null;
            return (
              <div key={cat.key}>
                <h3 className="font-bold text-gray-600 text-sm uppercase tracking-wide mb-2 mt-4 flex items-center gap-2">
                  <cat.icon size={16} /> {cat.label}
                </h3>
                <div className="space-y-2">
                  {prods.map((producto) => (
                    <div key={producto.id}
                      className={`glass rounded-2xl p-4 flex items-center gap-3 transition-all hover:-translate-y-1 ${!producto.activo ? 'opacity-60' : ''}`}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-orange-400 flex-shrink-0"
                        style={{ background: '#fff3e6' }}>
                        <cat.icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{producto.nombre}</p>
                          {!producto.activo && (
                            <span className="badge badge-entregado text-xs">Desactivado</span>
                          )}
                          {producto.stock === 0 && producto.activo && (
                            <span className="badge" style={{ background: '#fef2f2', color: '#dc3545' }}>Agotado</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="font-bold text-sm" style={{ color: '#ff6b35' }}>
                            S/ {producto.precio.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-500">Stock: {producto.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          id={`edit-${producto.id}`}
                          onClick={() => handleOpenEdit(producto)}
                          className="p-2 rounded-xl hover:bg-orange-50 transition-colors">
                          <Edit2 size={16} style={{ color: '#ff6b35' }} />
                        </button>
                        <button
                          id={`toggle-${producto.id}`}
                          onClick={() => handleToggle(producto)}
                          className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                          {producto.activo
                            ? <ToggleRight size={22} style={{ color: '#22c55e' }} />
                            : <ToggleLeft size={22} style={{ color: '#9ca3af' }} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-sheet">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: '#3e1f00' }}>
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button id="modal-close" onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input id="form-nombre" className="input-field" placeholder="Sándwich de Pollo"
                  value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea id="form-descripcion" className="input-field" rows={2} placeholder="Descripción del producto..."
                  value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio S/ *</label>
                  <input id="form-precio" className="input-field" type="number" step="0.5" min="0.5"
                    placeholder="4.50" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                  <input id="form-stock" className="input-field" type="number" min="0"
                    placeholder="20" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select id="form-categoria" className="input-field"
                  value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                  {CATEGORIAS.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen (opcional)</label>
                <input id="form-imagen" className="input-field" type="url" placeholder="https://..."
                  value={form.imagen_url} onChange={(e) => setForm({ ...form, imagen_url: e.target.value })} />
              </div>

              <button id="form-guardar" type="submit" className="btn-cafe w-full justify-center" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    {editingId ? 'Actualizar Producto' : 'Crear Producto'}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
