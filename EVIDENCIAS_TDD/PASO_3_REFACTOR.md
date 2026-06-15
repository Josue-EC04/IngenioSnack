# Evidencia TDD: PASO 3 — REFACTOR (Código Final Limpio)

## ¿Qué es la fase REFACTOR?

En TDD la fase **REFACTOR** consiste en **mejorar la calidad del código** sin cambiar su comportamiento.
Los 38 tests deben seguir pasando exactamente igual que en la fase GREEN, pero ahora el código es:
- Más **expresivo** y **legible**
- Con **responsabilidades bien separadas**
- Aplicando **principios SOLID** y **diseño simple de XP**

---

## Resumen de Code Smells Corregidos

| # | Code Smell (Problema) | Principio aplicado en el REFACTOR |
|---|-----------------------|-----------------------------------|
| 1 | Magic number `5.00` hardcodeado | Constante nombrada `COSTO_DELIVERY` |
| 2 | Bucles `for` imperativos | Métodos declarativos: `.reduce()`, `.find()`, `.filter()`, `.map()`, `.some()` |
| 3 | Función `calcularTotal` hace demasiado | **SRP** — Se extraen funciones auxiliares |
| 4 | Sin valor por defecto en `opciones` | Parámetro por defecto: `opciones = {}` |
| 5 | Concatenación de strings para errores | Template literals `` ` ` `` |
| 6 | Código verboso para crear arrays nuevos | `.filter()` y `.map()` declarativos |

---

## Código Refactorizado por Módulo

### `src/pedido.js` — Antes vs. Después

**❌ Antes (GREEN — Código que funciona pero es verboso):**
```javascript
function calcularTotal(productos, opciones) {
    let total = 0;
    for (let i = 0; i < productos.length; i++) {
        total += productos[i].precio;
    }
    if (opciones.conDelivery) { total += 5.00; }
    if (opciones.cafeGratis) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === 'Cafe') {
                total -= productos[i].precio;
                break;
            }
        }
    }
    return total;
}
```

**✅ Después (REFACTOR — Código limpio y expresivo):**
```javascript
const COSTO_DELIVERY = 5.00; // Constante nombrada (sin Magic Numbers)

/**
 * Calcula el total de un pedido aplicando cargos y descuentos.
 * Principio XP: Diseño Simple — el código expresa su intención claramente.
 */
function calcularTotal(productos, opciones = {}) {
    const subtotal      = calcularSubtotal(productos);
    const cargoDelivery = opciones.conDelivery ? COSTO_DELIVERY : 0;
    const descuento     = opciones.cafeGratis  ? obtenerDescuentoCafe(productos) : 0;
    return subtotal + cargoDelivery - descuento;
}

// SRP: función auxiliar con una sola responsabilidad — sumar precios
function calcularSubtotal(productos) {
    return productos.reduce((total, prod) => total + prod.precio, 0);
}

// SRP: función auxiliar con una sola responsabilidad — calcular descuento del café
function obtenerDescuentoCafe(productos) {
    const cafe = productos.find(
        prod => prod.nombre.toLowerCase() === 'café' || prod.nombre.toLowerCase() === 'cafe'
    );
    return cafe ? cafe.precio : 0;
}

module.exports = { calcularTotal };
```

**Mejoras aplicadas:**

| Antes | Después |
|-------|---------|
| `5.00` hardcodeado | Constante `COSTO_DELIVERY = 5.00` |
| 2 bucles `for` | `.reduce()` y `.find()` |
| 1 función con 3 responsabilidades | 3 funciones con responsabilidad única |
| Sin valor por defecto | `opciones = {}` protege contra `undefined` |

---

### `src/stock.js` — Antes vs. Después

**❌ Antes (GREEN — Código funcional pero mejorable):**
```javascript
function hayStock(producto, cantidad) {
    if (cantidad === undefined) cantidad = 1; // Manejo manual del default
    return producto.stock >= cantidad;
}

function reducirStock(producto, cantidad) {
    ...
    // Error message con concatenación:
    throw new Error('Stock insuficiente. Stock actual: ' + producto.stock + ', solicitado: ' + cantidad);
    ...
    return { nombre: producto.nombre, stock: producto.stock - cantidad }; // Spread operator no usado
}
```

**✅ Después (REFACTOR — Código limpio):**
```javascript
const STOCK_MINIMO = 0;

function agregarStock(producto, cantidad) {
    if (cantidad <= 0) throw new Error('La cantidad a agregar debe ser mayor a 0');
    return { ...producto, stock: producto.stock + cantidad }; // Spread: preserva todos los campos
}

function reducirStock(producto, cantidad) {
    if (cantidad <= 0) throw new Error('La cantidad a reducir debe ser mayor a 0');
    if (producto.stock - cantidad < STOCK_MINIMO) {
        throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}, solicitado: ${cantidad}`);
    }
    return { ...producto, stock: producto.stock - cantidad }; // Inmutabilidad con spread
}

function hayStock(producto, cantidad = 1) { // Valor por defecto nativo de JS
    return producto.stock >= cantidad;
}

module.exports = { agregarStock, reducirStock, hayStock };
```

**Mejoras aplicadas:**

| Antes | Después |
|-------|---------|
| `if (cantidad === undefined) cantidad = 1` | Parámetro por defecto `cantidad = 1` |
| `'texto' + variable + 'texto'` | Template literal `` `texto ${variable} texto` `` |
| `{ nombre: prod.nombre, stock: ... }` | Spread operator `{ ...producto, stock: ... }` |

---

### `src/menu.js` — Antes vs. Después

**❌ Antes (GREEN — Bucles `for` verbosos):**
```javascript
function agregarProducto(menu, nuevoProducto) {
    ...
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase()) {
            throw new Error('El producto "' + nuevoProducto.nombre + '" ya existe...');
        }
    }
    const nuevoMenu = [];
    for (let i = 0; i < menu.length; i++) nuevoMenu.push(menu[i]);
    nuevoMenu.push(nuevoProducto);
    return nuevoMenu;
}
```

**✅ Después (REFACTOR — Código declarativo y expresivo):**
```javascript
function agregarProducto(menu, nuevoProducto) {
    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '')
        throw new Error('El producto debe tener un nombre');
    if (nuevoProducto.precio == null || nuevoProducto.precio < 0)
        throw new Error('El precio del producto no puede ser negativo');

    const yaExiste = menu.some(p => p.nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase());
    if (yaExiste)
        throw new Error(`El producto "${nuevoProducto.nombre}" ya existe en el menu`);

    return [...menu, nuevoProducto]; // Spread operator — inmutable y expresivo
}

function eliminarProducto(menu, nombre) {
    const existe = menu.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (!existe) throw new Error(`El producto "${nombre}" no existe en el menu`);
    return menu.filter(p => p.nombre.toLowerCase() !== nombre.toLowerCase()); // .filter() vs bucle for
}

function actualizarPrecio(menu, nombre, nuevoPrecio) {
    if (nuevoPrecio < 0) throw new Error('El precio no puede ser negativo');
    const existe = menu.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (!existe) throw new Error(`El producto "${nombre}" no existe en el menu`);
    return menu.map(p =>                                                  // .map() vs bucle for
        p.nombre.toLowerCase() === nombre.toLowerCase()
            ? { ...p, precio: nuevoPrecio }
            : p
    );
}

function buscarProducto(menu, nombre) {
    return menu.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) || null; // .find() vs bucle
}

module.exports = { agregarProducto, eliminarProducto, actualizarPrecio, buscarProducto };
```

**Mejoras aplicadas:**

| Antes (bucle for) | Después (declarativo) |
|-------------------|-----------------------|
| `for` + push manual para buscar | `.some()` |
| `for` + push manual para copiar y agregar | Spread `[...menu, nuevoProducto]` |
| `for` + if para filtrar | `.filter()` |
| `for` + if para transformar | `.map()` |
| `for` para encontrar | `.find()` |

---

## Output Final del Test — Fase REFACTOR (38 Tests Pasando)

```
> ingeniosnack-root@1.0.0 test
> jest

PASS tests/pedido/pedido_01_total_con_delivery_y_cafe_gratis.test.js
PASS tests/pedido/pedido_02_total_sin_delivery_sin_cafe.test.js
PASS tests/pedido/pedido_03_total_con_delivery_sin_cafe.test.js
PASS tests/stock/stock_01_agregar_unidades.test.js
PASS tests/stock/stock_02_agregar_desde_stock_cero.test.js
PASS tests/stock/stock_03_agregar_inmutabilidad.test.js
PASS tests/stock/stock_04_error_agregar_cero_unidades.test.js
PASS tests/stock/stock_05_error_agregar_negativo.test.js
PASS tests/stock/stock_06_reducir_correctamente.test.js
PASS tests/stock/stock_07_reducir_hasta_cero.test.js
PASS tests/stock/stock_08_error_stock_insuficiente.test.js
PASS tests/stock/stock_09_error_reducir_cero.test.js
PASS tests/stock/stock_10_reducir_inmutabilidad.test.js
PASS tests/stock/stock_11_hay_stock_suficiente.test.js
PASS tests/stock/stock_12_stock_exacto.test.js
PASS tests/stock/stock_13_no_hay_stock.test.js
PASS tests/stock/stock_14_stock_en_cero.test.js
PASS tests/stock/stock_15_hay_stock_sin_cantidad.test.js
PASS tests/menu/menu_01_agregar_producto_nuevo.test.js
PASS tests/menu/menu_02_precio_registrado_correctamente.test.js
PASS tests/menu/menu_03_agregar_inmutabilidad.test.js
PASS tests/menu/menu_04_error_producto_duplicado.test.js
PASS tests/menu/menu_05_error_sin_nombre.test.js
PASS tests/menu/menu_06_error_precio_negativo.test.js
PASS tests/menu/menu_07_agregar_precio_cero.test.js
PASS tests/menu/menu_08_eliminar_producto.test.js
PASS tests/menu/menu_09_eliminar_no_afecta_otros.test.js
PASS tests/menu/menu_10_error_eliminar_inexistente.test.js
PASS tests/menu/menu_11_eliminar_case_insensitive.test.js
PASS tests/menu/menu_12_actualizar_precio.test.js
PASS tests/menu/menu_13_actualizar_no_afecta_otros.test.js
PASS tests/menu/menu_14_error_actualizar_inexistente.test.js
PASS tests/menu/menu_15_error_precio_negativo.test.js
PASS tests/menu/menu_16_actualizar_precio_cero.test.js
PASS tests/menu/menu_17_buscar_existente.test.js
PASS tests/menu/menu_18_buscar_case_insensitive.test.js
PASS tests/menu/menu_19_buscar_inexistente.test.js
PASS tests/menu/menu_20_buscar_datos_completos.test.js

Test Suites: 38 passed, 38 total
Tests:       38 passed, 38 total
Snapshots:   0 total
Time:        2.684 s, estimated 3 s
Ran all test suites.
```

---

## Conclusión del Ciclo Red-Green-Refactor

| Fase | Estado | Resultado |
|------|--------|-----------|
| 🔴 **RED** | ❌ 38 fallos | Tests escritos antes que la lógica. Stubs vacíos. |
| 🟢 **GREEN** | ✅ 38 pasan | Lógica mínima implementada. Code smells presentes. |
| 🔵 **REFACTOR** | ✅ 38 pasan | Código limpio con SRP, inmutabilidad, declarativo. |

### Principios de Diseño Aplicados

| Principio | Descripción | Módulos donde se aplicó |
|-----------|-------------|--------------------------|
| **SRP** — Responsabilidad Única | Cada función hace una sola cosa | `pedido.js` → `calcularSubtotal`, `obtenerDescuentoCafe` |
| **Diseño Simple (XP)** | El código expresa su intención sin comentarios extra | Todos |
| **Inmutabilidad** | Las funciones no modifican los objetos originales | `stock.js`, `menu.js` |
| **Sin Magic Numbers** | Los valores significativos tienen nombre | `COSTO_DELIVERY`, `STOCK_MINIMO` |
| **Programación Declarativa** | `.reduce()`, `.find()`, `.filter()`, `.map()`, `.some()` sobre bucles `for` | Todos |
