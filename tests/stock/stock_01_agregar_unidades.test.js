const { agregarStock } = require('../../src/stock');

test('el dueno puede agregar 10 unidades de Sandwich al stock', () => {
    const producto = { nombre: 'Sandwich', stock: 5 };
    const resultado = agregarStock(producto, 10);
    expect(resultado.stock).toBe(15);
});
