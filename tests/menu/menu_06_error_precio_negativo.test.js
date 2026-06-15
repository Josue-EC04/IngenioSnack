const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
];

test('debe lanzar un error si el precio del producto es negativo', () => {
    const precioNegativo = { nombre: 'Bebida Gratis', precio: -1.00, categoria: 'Bebidas' };
    expect(() => agregarProducto(menuInicial, precioNegativo)).toThrow('precio del producto no puede ser negativo');
});
