const { actualizarPrecio } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('el dueno puede actualizar el precio de un producto del menu', () => {
    const menuActualizado = actualizarPrecio(menuInicial, 'Sandwich', 15.00);
    const sandwichActualizado = menuActualizado.find(p => p.nombre === 'Sandwich');
    expect(sandwichActualizado.precio).toBe(15.00);
});
