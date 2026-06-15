const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('el precio del nuevo producto se registra correctamente', () => {
    const nuevoProducto = { nombre: 'Pastel de Choclo', precio: 9.50, categoria: 'Comida' };
    const menuActualizado = agregarProducto(menuInicial, nuevoProducto);
    const productoBuscado = menuActualizado.find(p => p.nombre === 'Pastel de Choclo');
    expect(productoBuscado.precio).toBe(9.50);
});
