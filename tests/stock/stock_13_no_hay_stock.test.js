const { hayStock } = require('../../src/stock');

test('retorna false si no hay suficiente stock para atender el pedido', () => {
    const producto = { nombre: 'Jugo', stock: 1 };
    expect(hayStock(producto, 3)).toBe(false);
});
