# Evidencia TDD: PASO 1 — RED (Test Unitario Fallando)

## Regla de Negocio Implementada
Calcular el total del pedido sumando el costo de los productos + S/ 5.00 de delivery, y aplicando el descuento si es el café gratis.

---

## ¿Qué es la fase RED?

En TDD (Test-Driven Development), la fase **RED** consiste en escribir primero la prueba unitaria **antes** de que exista la lógica que la hace pasar. El test debe **fallar obligatoriamente** en este paso. Esto nos obliga a pensar primero en qué debe hacer el código antes de cómo lo va a hacer.

---

## 1. Código del Test Unitario Escrito Primero

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

---

## 2. Código de Producción Inicial (Stub vacío que hace fallar el test)

### Archivo: `src/pedido.js`
```javascript
// Stub inicial: la función no tiene lógica implementada, devuelve 0.
// Esto es intencional en la fase RED: el test DEBE fallar aquí.
function calcularTotal(productos, opciones) {
    return 0;
}

module.exports = { calcularTotal };
```

---

## 3. Resultado del Comando `npm test` — Test FALLANDO (Fase RED)

```
> ingeniosnack-root@1.0.0 test
> jest

FAIL tests/pedido.test.js
  calcularTotal
    ✕ debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando café gratis si aplica (5 ms)

  ● calcularTotal › debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando café gratis si aplica

    expect(received).toBe(expected)

    Expected: 17
    Received: 0

      12 |         const total = calcularTotal(productos, { conDelivery: true, cafeGratis: true });
      13 |
    > 14 |         expect(total).toBe(17.00);
         |                       ^
      15 |     });
      16 | });

      at Object.<anonymous> (tests/pedido.test.js:14:23)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.612 s
Ran all test suites.
```

---

## 4. Análisis del Error

| Campo         | Detalle                                                       |
|---------------|---------------------------------------------------------------|
| **Estado**    | ❌ FAIL — La prueba falló como se esperaba en la fase RED     |
| **Esperado**  | `17.00` (suma de productos + delivery - descuento café)       |
| **Recibido**  | `0` (la función aún no tiene lógica implementada)             |
| **Causa**     | La función `calcularTotal` devuelve `0` sin hacer nada        |
| **Solución**  | Implementar la lógica mínima en `src/pedido.js` → PASO 2 GREEN|
