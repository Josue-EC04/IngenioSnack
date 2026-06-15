const { eliminarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
];

test('la eliminacion no distingue entre mayusculas y minusculas', () => {
    const menuActualizado = eliminarProducto(menuInicial, 'cafe');
    expect(menuActualizado.find(p => p.nombre === 'Cafe')).toBeUndefined();
});
