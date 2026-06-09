const { calcularTotal } = require('../src/pedido');

describe('calcularTotal', () => {
    test('debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando café gratis si aplica', () => {
        const productos = [
            { nombre: 'Sándwich', precio: 12.00 },
            { nombre: 'Café', precio: 6.00 }
        ];
        
        // Con delivery (S/ 5.00) y café gratis (resta el precio del café: S/ 6.00)
        // Total esperado: 12.00 (Sándwich) + 6.00 (Café) + 5.00 (Delivery) - 6.00 (Café Gratis) = 17.00
        const total = calcularTotal(productos, { conDelivery: true, cafeGratis: true });
        
        expect(total).toBe(17.00);
    });

    test('debe calcular el total sin delivery y sin café gratis', () => {
        const productos = [
            { nombre: 'Sándwich', precio: 12.00 },
            { nombre: 'Jugo', precio: 8.00 }
        ];
        
        const total = calcularTotal(productos, { conDelivery: false, cafeGratis: false });
        
        expect(total).toBe(20.00);
    });

    test('debe calcular el total con delivery pero sin café gratis', () => {
        const productos = [
            { nombre: 'Pastel', precio: 10.00 }
        ];
        
        const total = calcularTotal(productos, { conDelivery: true });
        
        expect(total).toBe(15.00);
    });
});
