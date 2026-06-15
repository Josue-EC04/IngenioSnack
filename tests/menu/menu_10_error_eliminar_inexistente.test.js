const { eliminarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
];

test('debe lanzar un error si el producto a eliminar no existe', () => {
    expect(() => eliminarProducto(menuInicial, 'Pizza')).toThrow('no existe en el menu');
});
