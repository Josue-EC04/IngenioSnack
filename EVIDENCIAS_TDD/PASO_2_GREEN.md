# Evidencia TDD: PASO 2 — GREEN (Test Unitario Pasando)

## Regla de Negocio Implementada
Calcular el total del pedido sumando el costo de los productos + S/ 5.00 de delivery, y aplicando el descuento si es el café gratis.

---

## ¿Qué es la fase GREEN?

En TDD, la fase **GREEN** consiste en escribir el **mínimo código necesario** para que el test que falló en la fase RED ahora pase. No importa si el código es feo o tiene code smells; el único objetivo es hacer que la prueba pase. La calidad se mejora en el siguiente paso (REFACTOR).

---

## 1. Código de Producción Mínimo para Pasar el Test

### Archivo: `src/pedido.js`
```javascript
// Implementación mínima (no limpia) para hacer pasar el test.
// En la fase GREEN solo importa que el test pase, no la calidad del código.
function calcularTotal(productos, opciones) {
    let total = 0;

    // Sumamos los precios de todos los productos
    for (let i = 0; i < productos.length; i++) {
        total += productos[i].precio;
    }

    // Si tiene delivery, sumamos S/ 5.00
    if (opciones.conDelivery) {
        total += 5.00;
    }

    // Si aplica café gratis, buscamos el primer café y restamos su precio
    if (opciones.cafeGratis) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === 'Café') {
                total -= productos[i].precio;
                break; // Descontar solo un café
            }
        }
    }

    return total;
}

module.exports = { calcularTotal };
```

---

## 2. Resultado del Comando `npm test` — Test PASANDO (Fase GREEN)

```
> ingeniosnack-root@1.0.0 test
> jest

PASS tests/pedido.test.js
  calcularTotal
    √ debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando café gratis si aplica (3 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.548 s
Ran all test suites.
```

---

## 3. Análisis del Resultado

| Campo          | Detalle                                                              |
|----------------|----------------------------------------------------------------------|
| **Estado**     | ✅ PASS — La prueba pasó correctamente                               |
| **Esperado**   | `17.00`                                                              |
| **Recibido**   | `17.00`  ✓                                                           |
| **Cálculo**    | S/ 12.00 (Sándwich) + S/ 6.00 (Café) + S/ 5.00 (Delivery) - S/ 6.00 (Café Gratis) = **S/ 17.00** |
| **Observación**| El código funciona pero usa bucles `for` redundantes → se mejora en REFACTOR |

---

## 4. ¿Por qué el código GREEN no es ideal?

Aunque el test pasa, se detectan los siguientes **code smells** en el código:

1. **Código con bucles `for` imperativos** — Son difíciles de leer y propensos a errores de índice.
2. **Variable mutable `total`** — El uso de `let` con múltiples asignaciones dificulta el rastreo del valor.
3. **Función con múltiples responsabilidades (SRP violado)** — `calcularTotal` hace demasiadas cosas: suma, agrega delivery y busca el café.
4. **Sin manejo de caso borde** — Si `opciones` no se pasa, la función lanzaría un error (`Cannot read property 'conDelivery' of undefined`).

→ Estos problemas se corrigen en el **PASO 3: REFACTOR**.
