const { reducirStock } = require('../../src/stock');

test('el stock puede reducirse hasta exactamente 0 unidades', () => {
    const producto = { nombre: 'Empanada', stock: 5 };
    const resultado = reducirStock(producto, 5);
    expect(resultado.stock).toBe(0);
});
