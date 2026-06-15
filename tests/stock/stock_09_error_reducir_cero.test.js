const { reducirStock } = require('../../src/stock');

test('debe lanzar un error si se intenta reducir 0 unidades', () => {
    const producto = { nombre: 'Sandwich', stock: 10 };
    expect(() => reducirStock(producto, 0)).toThrow('La cantidad a reducir debe ser mayor a 0');
});
