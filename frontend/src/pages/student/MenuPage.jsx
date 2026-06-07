import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { Plus, Minus, ShoppingCart, Search, Coffee, Utensils, Sandwich, Cookie } from 'lucide-react';

const CATEGORIAS = [
  { key: 'todos', label: 'Todos', icon: Utensils },
  { key: 'sandwiches', label: 'Sándwiches', icon: Sandwich },
  { key: 'bebidas', label: 'Bebidas', icon: Coffee },
  { key: 'snacks', label: 'Snacks', icon: Cookie },
];

function getFallbackIcon(categoria) {
  const map = {
    sandwiches: Sandwich,
    bebidas: Coffee,
    snacks: Cookie
  };
  return map[categoria] || Utensils;
}

function ProductCard({ producto }) {
  const { items, addItem, updateCantidad } = useCart();
  const [adding, setAdding] = useState(false);

  const itemEnCarrito = items.find((i) => i.producto_id === producto.id);
  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  const agotado = !producto.activo || producto.stock === 0;

  const handleAdd = () => {
    if (agotado) return;
    setAdding(true);
    addItem(producto);
    toast.success(`${producto.nombre} agregado al carrito 🛒`, { duration: 1500 });
    setTimeout(() => setAdding(false), 300);
  };

  return (
    <div className={`product-card animate-fade-in-up ${agotado ? 'opacity-60' : ''}`}>
      {/* Imagen / Emoji */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, rgba(255,243,230,0.5) 0%, rgba(255,232,214,0.5) 100%)', height: '140px' }}>
        <div className="absolute inset-0 flex items-center justify-center text-5xl text-orange-200">
          {producto.imagen_url ? (
            <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
          ) : (
            (() => {
              const Icon = getFallbackIcon(producto.categoria);
              return <Icon size={48} strokeWidth={1.5} />;
            })()
          )}
        </div>
        {agotado && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-gray-700">Agotado</span>
          </div>
        )}
        {!agotado && producto.stock <= 5 && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-orange-700 bg-orange-100">
              ¡Solo {producto.stock}!
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-base leading-tight mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-xs text-gray-500 leading-tight mb-2 line-clamp-2">{producto.descripcion}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: '#ff6b35', fontFamily: 'var(--font-display)' }}>
            S/ {producto.precio.toFixed(2)}
          </span>

          {agotado ? (
            <span className="text-xs text-gray-400">No disponible</span>
          ) : cantidadEnCarrito > 0 ? (
            <div className="flex items-center gap-2">
              <button
                id={`minus-${producto.id}`}
                onClick={() => updateCantidad(producto.id, cantidadEnCarrito - 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#fff3e6', color: '#ff6b35' }}
              >
                <Minus size={14} />
              </button>
              <span className="font-bold text-sm w-4 text-center" style={{ color: '#3e1f00' }}>
                {cantidadEnCarrito}
              </span>
              <button
                id={`plus-${producto.id}`}
                onClick={() => addItem(producto)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#ff6b35', color: 'white' }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              id={`add-${producto.id}`}
              onClick={handleAdd}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${adding ? 'scale-90' : 'hover:scale-110'}`}
              style={{ background: '#ff6b35', color: 'white' }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaInicial = searchParams.get('categoria') || 'todos';
  const [categoriaActiva, setCategoriaActiva] = useState(categoriaInicial);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoriaActiva !== 'todos') params.categoria = categoriaActiva;
        const res = await api.get('/productos', { params });
        setProductos(res.data);
      } catch (err) {
        toast.error('Error al cargar el menú');
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [categoriaActiva]);

  const productosFiltrados = busqueda
    ? productos.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    : productos;

  const handleCategoria = (key) => {
    setCategoriaActiva(key);
    setSearchParams(key !== 'todos' ? { categoria: key } : {});
  };

  return (
    <div className="page-content pb-24">
      {/* Búsqueda */}
      <div className="px-4 pt-4 mb-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="menu-busqueda"
            type="text"
            className="input-field pl-10"
            placeholder="Buscar en el menú..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros de categoría */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.key}
              id={`filter-${cat.key}`}
              onClick={() => handleCategoria(cat.key)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                categoriaActiva === cat.key
                  ? { background: '#3e1f00', color: 'white' }
                  : { background: 'white', color: '#6b5c50', border: '1px solid #e5e0d9' }
              }
            >
              <cat.icon size={16} strokeWidth={2.5} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de productos */}
      <div className="px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-3">
              <Utensils size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              {busqueda ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {productosFiltrados.map((producto, i) => (
              <div key={producto.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
