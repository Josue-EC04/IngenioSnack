const { actualizarPrecio } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('actualizar el precio de un producto no afecta a los otros', () => {
    const menuActualizado = actualizarPrecio(menuInicial, 'Cafe', 7.50);
    const jugo = menuActualizado.find(p => p.nombre === 'Jugo de Naranja');
    expect(jugo.precio).toBe(8.00);
});
