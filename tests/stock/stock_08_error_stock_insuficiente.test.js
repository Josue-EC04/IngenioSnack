const { reducirStock } = require('../../src/stock');

test('debe lanzar un error si el stock es insuficiente para la venta', () => {
    const producto = { nombre: 'Jugo', stock: 2 };
    expect(() => reducirStock(producto, 5)).toThrow('Stock insuficiente');
});
