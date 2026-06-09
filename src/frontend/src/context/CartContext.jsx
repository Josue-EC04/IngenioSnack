import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto_id === producto.id);
      if (existing) {
        return prev.map((i) =>
          i.producto_id === producto.id
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i
        );
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad,
          imagen_url: producto.imagen_url,
          categoria: producto.categoria,
          stock: producto.stock,
        },
      ];
    });
  };

  const removeItem = (producto_id) => {
    setItems((prev) => prev.filter((i) => i.producto_id !== producto_id));
  };

  const updateCantidad = (producto_id, cantidad) => {
    if (cantidad <= 0) {
      removeItem(producto_id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.producto_id === producto_id ? { ...i, cantidad } : i))
    );
  };

  const clearCart = () => setItems([]);

  const removeItems = (ids) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.producto_id)));
  };

  const total = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateCantidad, clearCart, removeItems, total, cantidadTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
