# Evidencia 1: Paso 1 - RED (Test Unitario Fallando)

## Regla de Negocio Elegida
*Calcular el total del pedido sumando el costo de los productos + S/ 5.00 de delivery, y aplicando el descuento si es el café gratis.*

## 1. Código del Test Unitario (Failing Test)

### Archivo: `tests/pedido.test.js`
```javascript
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
});
```

### Archivo: `src/pedido.js` (Stub Inicial que hace fallar el test)
```javascript
// El test fallará porque la función devuelve 0 y no implementa la lógica
function calcularTotal(productos, opciones) {
    return 0;
}

module.exports = { calcularTotal };
```

## 2. Captura de Pantalla del Test Fallando
*(Reemplaza la imagen de abajo con tu propia captura de pantalla de Jest en rojo)*

![Test Unitario Fallando (Red)](./test_failing_red.png)

