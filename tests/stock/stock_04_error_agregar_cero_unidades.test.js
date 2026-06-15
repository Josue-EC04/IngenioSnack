const { agregarStock } = require('../../src/stock');

test('debe lanzar un error si se intenta agregar 0 unidades', () => {
    const producto = { nombre: 'Pastel', stock: 10 };
    expect(() => agregarStock(producto, 0)).toThrow('La cantidad a agregar debe ser mayor a 0');
});
