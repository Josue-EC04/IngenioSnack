const { hayStock } = require('../../src/stock');

test('retorna true si no se especifica cantidad y hay al menos 1 unidad', () => {
    const producto = { nombre: 'Empanada', stock: 10 };
    expect(hayStock(producto)).toBe(true);
});
