const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('no debe modificar el menu original al agregar un producto', () => {
    const nuevoProducto = { nombre: 'Torta', precio: 7.00, categoria: 'Postres' };
    agregarProducto(menuInicial, nuevoProducto);
    expect(menuInicial).toHaveLength(3);
});
