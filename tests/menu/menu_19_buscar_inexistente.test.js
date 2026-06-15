const { buscarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
];

test('retorna null si el producto no existe en el menu', () => {
    const producto = buscarProducto(menuInicial, 'Hamburguesa');
    expect(producto).toBeNull();
});
