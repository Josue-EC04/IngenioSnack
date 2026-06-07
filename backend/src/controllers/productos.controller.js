const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// GET /api/productos — Obtener todos los productos activos
const getProductos = async (req, res) => {
  const { categoria, incluir_inactivos } = req.query;

  try {
    const where = {};
    
    // Si no se pide explícitamente incluir inactivos (solo admins pueden), filtrar activos
    if (incluir_inactivos !== 'true' || !req.user || req.user.rol !== 'admin') {
      where.activo = true;
    }

    if (categoria) {
      where.categoria = categoria;
    }

    const productos = await prisma.producto.findMany({
      where,
      orderBy: [{ categoria: 'asc' }, { nombre: 'asc' }],
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// GET /api/productos/:id
const getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// POST /api/productos — Crear producto (solo admin)
const createProducto = async (req, res) => {
  const { nombre, descripcion, precio, categoria, imagen_url, stock } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
  }

  const categoriasValidas = ['sandwiches', 'bebidas', 'snacks'];
  if (!categoriasValidas.includes(categoria)) {
    return res.status(400).json({ error: 'Categoría inválida. Use: sandwiches, bebidas, snacks' });
  }

  if (precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  }

  try {
    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        precio: parseFloat(precio),
        categoria,
        imagen_url: imagen_url || null,
        stock: parseInt(stock) || 0,
        activo: true,
      },
    });

    res.status(201).json(producto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// PUT /api/productos/:id — Actualizar producto (solo admin)
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, imagen_url, stock, activo } = req.body;

  try {
    const productoExistente = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const dataToUpdate = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre;
    if (descripcion !== undefined) dataToUpdate.descripcion = descripcion;
    if (precio !== undefined) dataToUpdate.precio = parseFloat(precio);
    if (categoria !== undefined) dataToUpdate.categoria = categoria;
    if (imagen_url !== undefined) dataToUpdate.imagen_url = imagen_url;
    if (stock !== undefined) dataToUpdate.stock = parseInt(stock);
    if (activo !== undefined) dataToUpdate.activo = activo;

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.json(producto);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// PATCH /api/productos/:id/toggle — Activar/Desactivar producto
const toggleProducto = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: { activo: !producto.activo },
    });

    res.json({
      message: productoActualizado.activo ? 'Producto activado' : 'Producto desactivado',
      producto: productoActualizado,
    });
  } catch (error) {
    console.error('Error al toggle producto:', error);
    res.status(500).json({ error: 'Error al cambiar estado del producto' });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, toggleProducto };
