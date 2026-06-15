const { hayStock } = require('../../src/stock');

test('retorna true si hay suficiente stock para atender el pedido', () => {
    const producto = { nombre: 'Cafe', stock: 5 };
    expect(hayStock(producto, 3)).toBe(true);
});
