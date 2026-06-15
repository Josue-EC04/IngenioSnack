const { calcularTotal } = require('../../src/pedido');

test('debe calcular el total sin delivery y sin cafe gratis', () => {
    const productos = [
        { nombre: 'Sandwich', precio: 12.00 },
        { nombre: 'Jugo', precio: 8.00 }
    ];
    const total = calcularTotal(productos, { conDelivery: false, cafeGratis: false });
    expect(total).toBe(20.00);
});
