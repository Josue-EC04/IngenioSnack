const { buscarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
];

test('la busqueda no distingue entre mayusculas y minusculas', () => {
    const producto = buscarProducto(menuInicial, 'sandwich');
    expect(producto).not.toBeNull();
    expect(producto.nombre).toBe('Sandwich');
});
