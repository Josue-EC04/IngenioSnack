const { reducirStock } = require('../../src/stock');

test('no debe modificar el objeto original al reducir stock', () => {
    const producto = { nombre: 'Pastel', stock: 8 };
    reducirStock(producto, 3);
    expect(producto.stock).toBe(8);
});
