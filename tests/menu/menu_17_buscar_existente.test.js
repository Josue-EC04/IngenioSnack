const { buscarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('el dueno puede encontrar un producto del menu por su nombre', () => {
    const producto = buscarProducto(menuInicial, 'Cafe');
    expect(producto).not.toBeNull();
    expect(producto.precio).toBe(6.00);
});
