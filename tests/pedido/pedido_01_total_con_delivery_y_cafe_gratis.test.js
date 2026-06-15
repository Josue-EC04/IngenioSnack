const { calcularTotal } = require('../../src/pedido');

test('debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando cafe gratis si aplica', () => {
    const productos = [
        { nombre: 'Sandwich', precio: 12.00 },
        { nombre: 'Cafe', precio: 6.00 }
    ];
    // Total: 12 + 6 + 5 (delivery) - 6 (cafe gratis) = 17
    const total = calcularTotal(productos, { conDelivery: true, cafeGratis: true });
    expect(total).toBe(17.00);
});
