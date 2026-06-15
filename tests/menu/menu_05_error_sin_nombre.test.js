const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
];

test('debe lanzar un error si el producto no tiene nombre', () => {
    const sinNombre = { nombre: '', precio: 5.00, categoria: 'Comida' };
    expect(() => agregarProducto(menuInicial, sinNombre)).toThrow('El producto debe tener un nombre');
});
