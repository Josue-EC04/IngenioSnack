const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Cafe', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

test('el dueno puede agregar un nuevo producto al menu', () => {
    const nuevoProducto = { nombre: 'Empanada', precio: 5.00, categoria: 'Comida' };
    const menuActualizado = agregarProducto(menuInicial, nuevoProducto);
    expect(menuActualizado).toHaveLength(4);
    expect(menuActualizado[3].nombre).toBe('Empanada');
});
