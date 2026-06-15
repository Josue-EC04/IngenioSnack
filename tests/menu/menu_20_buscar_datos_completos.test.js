const { buscarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('la busqueda devuelve todos los datos del producto (nombre, precio, categoria)', () => {
    const producto = buscarProducto(menuInicial, 'Jugo de Naranja');
    expect(producto).toEqual({ nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' });
});
