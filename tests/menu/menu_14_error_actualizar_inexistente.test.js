const { actualizarPrecio } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
];

test('debe lanzar un error si el producto no existe en el menu', () => {
    expect(() => actualizarPrecio(menuInicial, 'Hamburguesa', 20.00)).toThrow('no existe en el menu');
});
