const { hayStock } = require('../../src/stock');

test('retorna false si el stock es 0', () => {
    const producto = { nombre: 'Pastel', stock: 0 };
    expect(hayStock(producto)).toBe(false);
});
