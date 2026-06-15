const { agregarStock } = require('../../src/stock');

test('el dueno puede agregar stock a un producto que tenia 0 unidades', () => {
    const producto = { nombre: 'Jugo de Naranja', stock: 0 };
    const resultado = agregarStock(producto, 20);
    expect(resultado.stock).toBe(20);
});
