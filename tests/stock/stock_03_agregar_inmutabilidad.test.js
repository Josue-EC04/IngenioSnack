const { agregarStock } = require('../../src/stock');

test('no debe modificar el objeto original al agregar stock', () => {
    const producto = { nombre: 'Cafe', stock: 8 };
    agregarStock(producto, 5);
    expect(producto.stock).toBe(8);
});
