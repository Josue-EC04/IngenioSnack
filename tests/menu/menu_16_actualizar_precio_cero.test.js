const { actualizarPrecio } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
];

test('se puede actualizar el precio a S/ 0.00 (para promocion gratuita)', () => {
    const menuActualizado = actualizarPrecio(menuInicial, 'Cafe', 0);
    const cafe = menuActualizado.find(p => p.nombre === 'Cafe');
    expect(cafe.precio).toBe(0);
});
