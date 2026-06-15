const { agregarProducto } = require('../../src/menu');
const menuInicial = [
    { nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' },
];

test('se puede agregar un producto con precio S/ 0.00 (producto gratuito)', () => {
    const productoGratis = { nombre: 'Vaso de Agua', precio: 0, categoria: 'Bebidas' };
    const menuActualizado = agregarProducto(menuInicial, productoGratis);
    expect(menuActualizado).toHaveLength(2);
});
