const { reducirStock } = require('../../src/stock');

test('el stock se reduce correctamente cuando se vende un producto', () => {
    const producto = { nombre: 'Cafe', stock: 10 };
    const resultado = reducirStock(producto, 3);
    expect(resultado.stock).toBe(7);
});
