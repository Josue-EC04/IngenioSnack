const { eliminarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('el dueno puede eliminar un producto del menu', () => {
    const menuActualizado = eliminarProducto(menuInicial, 'Cafe');
    expect(menuActualizado).toHaveLength(2);
    expect(menuActualizado.find(p => p.nombre === 'Cafe')).toBeUndefined();
});
