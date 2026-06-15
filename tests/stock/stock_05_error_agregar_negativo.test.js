const { agregarStock } = require('../../src/stock');

test('debe lanzar un error si se intenta agregar una cantidad negativa', () => {
    const producto = { nombre: 'Empanada', stock: 10 };
    expect(() => agregarStock(producto, -5)).toThrow('La cantidad a agregar debe ser mayor a 0');
});
