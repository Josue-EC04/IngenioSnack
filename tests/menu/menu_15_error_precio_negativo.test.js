const { actualizarPrecio } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
];

test('debe lanzar un error si el nuevo precio es negativo', () => {
    expect(() => actualizarPrecio(menuInicial, 'Cafe', -3.00)).toThrow('El precio no puede ser negativo');
});
