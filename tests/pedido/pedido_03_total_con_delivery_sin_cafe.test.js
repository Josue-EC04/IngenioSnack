const { calcularTotal } = require('../../src/pedido');

test('debe calcular el total con delivery pero sin cafe gratis', () => {
    const productos = [
        { nombre: 'Pastel', precio: 10.00 }
    ];
    const total = calcularTotal(productos, { conDelivery: true });
    expect(total).toBe(15.00);
});
