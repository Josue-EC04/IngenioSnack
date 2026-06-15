const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('debe lanzar un error si se intenta agregar un producto ya existente', () => {
    const duplicado = { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' };
    expect(() => agregarProducto(menuInicial, duplicado)).toThrow('ya existe en el menu');
});
