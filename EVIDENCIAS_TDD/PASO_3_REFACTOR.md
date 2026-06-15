# Evidencia TDD: PASO 3 — REFACTOR (Código Final Limpio)

## Regla de Negocio Implementada
Calcular el total del pedido sumando el costo de los productos + S/ 5.00 de delivery, y aplicando el descuento si es el café gratis.

---

## ¿Qué es la fase REFACTOR?

En TDD, la fase **REFACTOR** consiste en **mejorar la calidad del código** (legibilidad, estructura, principios SOLID) **sin cambiar su comportamiento**. El test sigue pasando exactamente igual que en la fase GREEN, pero ahora el código es más limpio, expresivo y fácil de mantener.

---

## 1. Code Smells Detectados en la Fase GREEN

| #  | Code Smell                              | Problema                                                      |
|----|-----------------------------------------|---------------------------------------------------------------|
| 1  | **Función con múltiples responsabilidades** | `calcularTotal` sumaba, aplicaba delivery Y buscaba el café. |
| 2  | **Bucles `for` imperativos redundantes** | Difíciles de leer y propensos a errores de índice.           |
| 3  | **Variable mutable (`let total = 0`)**  | Dificulta el rastreo del valor a lo largo de la función.     |
| 4  | **Sin valor por defecto en `opciones`** | Si `opciones` no se pasa, la función lanzaría un error.      |
| 5  | **Magic number (`5.00` hardcodeado)**   | El costo del delivery no tenía nombre ni era fácilmente cambiable. |

---

## 2. Código Final Refactorizado

### Archivo: `src/pedido.js` — Después de la Refactorización

```javascript
const COSTO_DELIVERY = 5.00; // Constante nombrada (sin Magic Numbers)

/**
 * Calcula el total de un pedido aplicando cargos de envío y descuentos especiales.
 * Cumple con el principio de Diseño Simple de XP (Código claro y expresivo).
 * @param {Array} productos - Lista de productos con nombre y precio.
 * @param {Object} opciones - Opciones del pedido: conDelivery, cafeGratis.
 * @returns {number} Total del pedido en soles.
 */
function calcularTotal(productos, opciones = {}) {
    const subtotal = calcularSubtotal(productos);
    const cargoDelivery = opciones.conDelivery ? COSTO_DELIVERY : 0;
    const descuento = opciones.cafeGratis ? obtenerDescuentoCafe(productos) : 0;

    return subtotal + cargoDelivery - descuento;
}

// Función auxiliar: Suma el precio de todos los productos (Responsabilidad Única)
function calcularSubtotal(productos) {
    return productos.reduce((total, prod) => total + prod.precio, 0);
}

// Función auxiliar: Busca y retorna el precio del café para aplicar el descuento
function obtenerDescuentoCafe(productos) {
    const cafe = productos.find(
        prod => prod.nombre.toLowerCase() === 'café' || prod.nombre.toLowerCase() === 'cafe'
    );
    return cafe ? cafe.precio : 0;
}

module.exports = { calcularTotal };
```

---

## 3. Principios de Diseño Aplicados

| Principio                    | Aplicación en el código                                                     |
|------------------------------|-----------------------------------------------------------------------------|
| **SRP (Single Responsibility)** | Se crearon funciones auxiliares: `calcularSubtotal` y `obtenerDescuentoCafe`, cada una con una sola responsabilidad. |
| **Diseño Simple (XP)**        | El código dice exactamente lo que hace, sin comentarios explicativos innecesarios. |
| **Evitar Magic Numbers**      | El valor `5.00` se extrajo a la constante `COSTO_DELIVERY`.                |
| **Programación declarativa**  | Se reemplazaron los bucles `for` por `.reduce()` y `.find()`, más expresivos. |
| **Robustez (Defensive Coding)**| Se agregó `opciones = {}` como valor por defecto para evitar errores si no se pasa el argumento. |

---

## 4. Comparación Antes vs. Después

### ❌ Antes (GREEN — Código que funciona pero no es limpio)
```javascript
function calcularTotal(productos, opciones) {
    let total = 0;
    for (let i = 0; i < productos.length; i++) {
        total += productos[i].precio;
    }
    if (opciones.conDelivery) { total += 5.00; }
    if (opciones.cafeGratis) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === 'Café') {
                total -= productos[i].precio;
                break;
            }
        }
    }
    return total;
}
```

### ✅ Después (REFACTOR — Código limpio y expresivo)
```javascript
const COSTO_DELIVERY = 5.00;

function calcularTotal(productos, opciones = {}) {
    const subtotal = calcularSubtotal(productos);
    const cargoDelivery = opciones.conDelivery ? COSTO_DELIVERY : 0;
    const descuento = opciones.cafeGratis ? obtenerDescuentoCafe(productos) : 0;
    return subtotal + cargoDelivery - descuento;
}

function calcularSubtotal(productos) {
    return productos.reduce((total, prod) => total + prod.precio, 0);
}

function obtenerDescuentoCafe(productos) {
    const cafe = productos.find(prod => prod.nombre.toLowerCase() === 'café' || prod.nombre.toLowerCase() === 'cafe');
    return cafe ? cafe.precio : 0;
}
```

---

## 5. Resultado del Comando `npm test` — Todos los Tests PASANDO tras la Refactorización

```
> ingeniosnack-root@1.0.0 test
> jest

PASS tests/pedido.test.js
  calcularTotal
    √ debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando café gratis si aplica (2 ms)
    √ debe calcular el total sin delivery y sin café gratis (1 ms)
    √ debe calcular el total con delivery pero sin café gratis (1 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.527 s, estimated 1 s
Ran all test suites.
```

---

## 6. Conclusión

| Paso     | Estado | Resultado                                                          |
|----------|--------|--------------------------------------------------------------------|
| 🔴 RED   | ❌ FAIL | El test falló como se esperaba. La función devolvía `0`.          |
| 🟢 GREEN | ✅ PASS | El test pasó con una implementación mínima (código con code smells). |
| 🔵 REFACTOR | ✅ PASS | El código se mejoró aplicando principios SOLID y XP. Todos los tests siguen pasando. |
