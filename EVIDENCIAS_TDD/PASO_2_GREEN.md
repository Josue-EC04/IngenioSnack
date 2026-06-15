# Evidencia TDD: PASO 2 — GREEN (Tests Unitarios Pasando)

## ¿Qué es la fase GREEN?

En TDD la fase **GREEN** consiste en escribir el **mínimo código posible** para que cada test que fallaba en la fase RED ahora pase. No importa si el código no es elegante; solo importa que los 38 tests pasen.

> En este proyecto se implementaron **3 módulos de negocio** con la lógica mínima para que los **38 tests** pasen.

---

## Implementación Mínima de Cada Módulo

### `src/pedido.js` — Implementación GREEN

```javascript
// Implementación funcional pero sin estructura limpia (code smells presentes)
function calcularTotal(productos, opciones) {
    let total = 0;

    // Sumamos los precios de todos los productos con bucle for
    for (let i = 0; i < productos.length; i++) {
        total += productos[i].precio;
    }

    // Si tiene delivery, sumamos S/ 5.00
    if (opciones.conDelivery) {
        total += 5.00; // Magic number: el costo está hardcodeado
    }

    // Si aplica café gratis, buscamos el primer café y restamos su precio
    if (opciones.cafeGratis) {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === 'Cafe') { // Sin manejo de tildes
                total -= productos[i].precio;
                break;
            }
        }
    }
    return total;
}

module.exports = { calcularTotal };
```

### `src/stock.js` — Implementación GREEN

```javascript
// Implementación funcional pero con validaciones acopladas a la función principal
function agregarStock(producto, cantidad) {
    if (cantidad <= 0) {
        throw new Error('La cantidad a agregar debe ser mayor a 0');
    }
    // Muta el objeto directamente (code smell: no es inmutable)
    return { nombre: producto.nombre, stock: producto.stock + cantidad };
}

function reducirStock(producto, cantidad) {
    if (cantidad <= 0) {
        throw new Error('La cantidad a reducir debe ser mayor a 0');
    }
    if (producto.stock - cantidad < 0) {
        throw new Error('Stock insuficiente. Stock actual: ' + producto.stock + ', solicitado: ' + cantidad);
    }
    return { nombre: producto.nombre, stock: producto.stock - cantidad };
}

function hayStock(producto, cantidad) {
    if (cantidad === undefined) cantidad = 1; // Manejo manual del valor por defecto
    return producto.stock >= cantidad;
}

module.exports = { agregarStock, reducirStock, hayStock };
```

### `src/menu.js` — Implementación GREEN

```javascript
// Implementación funcional pero con if-else anidados y sin separación de responsabilidades
function agregarProducto(menu, nuevoProducto) {
    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '') {
        throw new Error('El producto debe tener un nombre');
    }
    if (nuevoProducto.precio == null || nuevoProducto.precio < 0) {
        throw new Error('El precio del producto no puede ser negativo');
    }
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase()) {
            throw new Error('El producto "' + nuevoProducto.nombre + '" ya existe en el menu');
        }
    }
    const nuevoMenu = [];
    for (let i = 0; i < menu.length; i++) nuevoMenu.push(menu[i]);
    nuevoMenu.push(nuevoProducto);
    return nuevoMenu;
}

function eliminarProducto(menu, nombre) {
    let encontrado = false;
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nombre.toLowerCase()) {
            encontrado = true; break;
        }
    }
    if (!encontrado) throw new Error('El producto "' + nombre + '" no existe en el menu');
    const nuevoMenu = [];
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() !== nombre.toLowerCase()) nuevoMenu.push(menu[i]);
    }
    return nuevoMenu;
}

function actualizarPrecio(menu, nombre, nuevoPrecio) {
    if (nuevoPrecio < 0) throw new Error('El precio no puede ser negativo');
    let encontrado = false;
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nombre.toLowerCase()) { encontrado = true; break; }
    }
    if (!encontrado) throw new Error('El producto "' + nombre + '" no existe en el menu');
    const nuevoMenu = [];
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nombre.toLowerCase()) {
            nuevoMenu.push({ nombre: menu[i].nombre, precio: nuevoPrecio, categoria: menu[i].categoria });
        } else {
            nuevoMenu.push(menu[i]);
        }
    }
    return nuevoMenu;
}

function buscarProducto(menu, nombre) {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].nombre.toLowerCase() === nombre.toLowerCase()) return menu[i];
    }
    return null;
}

module.exports = { agregarProducto, eliminarProducto, actualizarPrecio, buscarProducto };
```

---

## Code Smells Detectados en la Fase GREEN

Aunque los 38 tests pasan, se identifican los siguientes problemas de calidad de código:

| # | Code Smell | Módulo afectado | Descripción del problema |
|---|-----------|-----------------|--------------------------|
| 1 | **Magic Number** | `pedido.js` | El costo de delivery `5.00` está hardcodeado sin un nombre descriptivo |
| 2 | **Bucles `for` imperativos** | Todos | Se usan bucles for donde `.reduce()`, `.find()`, `.some()` serían más legibles |
| 3 | **Función con múltiples responsabilidades** | `pedido.js` | `calcularTotal` suma, aplica delivery y busca el café en una sola función |
| 4 | **Sin valor por defecto en parámetros** | `pedido.js`, `stock.js` | Si `opciones` no se pasa, la función lanza un error de `undefined` |
| 5 | **Concatenación de strings para errores** | `menu.js` | Se usa `+` para mensajes en lugar de template literals |
| 6 | **Código verboso sin expresividad** | `menu.js` | Los bucles `for` para crear un nuevo array son reemplazables por `.filter()` y `.map()` |

→ Todos estos problemas se resuelven en la **Fase REFACTOR**.

---

## Output del Test — Fase GREEN (38 Tests Pasando)

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
Time:        2.684 s
Ran all test suites.
```

---

## Resumen de la Fase GREEN

| Módulo  | Tests | Estado GREEN |
|---------|-------|--------------|
| Pedido  | 3     | ✅ 3 pasan  |
| Stock   | 15    | ✅ 15 pasan |
| Menú    | 20    | ✅ 20 pasan |
| **Total** | **38** | **✅ 38 pasan** |

→ Se procede a la **Fase REFACTOR**: mejorar la calidad del código sin cambiar el comportamiento.
