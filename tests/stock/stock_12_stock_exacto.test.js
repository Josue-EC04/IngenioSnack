const { hayStock } = require('../../src/stock');

test('retorna true si el stock es exactamente igual a la cantidad solicitada', () => {
    const producto = { nombre: 'Sandwich', stock: 4 };
    expect(hayStock(producto, 4)).toBe(true);
});
