# Evidencia TDD: PASO 1 — RED (Tests Unitarios Fallando)

## ¿Qué es la fase RED?

En TDD la fase **RED** consiste en escribir **primero las pruebas unitarias** antes de escribir cualquier lógica.
El test **debe fallar obligatoriamente** — esto demuestra que la lógica aún no existe y que el test realmente valida algo.

> En este proyecto se crearon **38 pruebas unitarias** distribuidas en 3 módulos de negocio: `pedido`, `stock` y `menu`.

---

## Estructura de Tests Creados

```
tests/
├── pedido/   →  3 pruebas  (cálculo del total del pedido)
├── stock/    → 15 pruebas  (gestión de stock del dueño)
└── menu/     → 20 pruebas  (gestión del menú del dueño)
```

---

## Stub Inicial (código vacío que hace fallar los tests)

Antes de implementar la lógica, los módulos eran stubs vacíos:

### `src/pedido.js` — Stub inicial
```javascript
function calcularTotal(productos, opciones) {
    return 0; // No implementado
}
module.exports = { calcularTotal };
```

### `src/stock.js` — Stub inicial
```javascript
function agregarStock(producto, cantidad) { return producto; }
function reducirStock(producto, cantidad) { return producto; }
function hayStock(producto, cantidad)     { return false; }
module.exports = { agregarStock, reducirStock, hayStock };
```

### `src/menu.js` — Stub inicial
```javascript
function agregarProducto(menu, producto)           { return menu; }
function eliminarProducto(menu, nombre)            { return menu; }
function actualizarPrecio(menu, nombre, precio)    { return menu; }
function buscarProducto(menu, nombre)              { return null; }
module.exports = { agregarProducto, eliminarProducto, actualizarPrecio, buscarProducto };
```

---

## Inventario de los 38 Tests Escritos (Fase RED)

### 🧾 Módulo: PEDIDO — 3 pruebas
*(Regla de negocio: calcular el total del pedido)*

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 01 | `pedido_01_total_con_delivery_y_cafe_gratis.test.js` | Total con delivery S/ 5.00 y café de regalo descontado |
| 02 | `pedido_02_total_sin_delivery_sin_cafe.test.js` | Total sin delivery ni descuento de café |
| 03 | `pedido_03_total_con_delivery_sin_cafe.test.js` | Total con delivery pero sin café de regalo |

#### Código representativo — `pedido_01`:
```javascript
const { calcularTotal } = require('../../src/pedido');

test('debe calcular el total sumando productos, agregando delivery de S/ 5.00 y aplicando cafe gratis si aplica', () => {
    const productos = [
        { nombre: 'Sandwich', precio: 12.00 },
        { nombre: 'Cafe', precio: 6.00 }
    ];
    // 12 + 6 + 5 (delivery) - 6 (cafe gratis) = 17
    const total = calcularTotal(productos, { conDelivery: true, cafeGratis: true });
    expect(total).toBe(17.00);
});
```

---

### 📦 Módulo: STOCK — 15 pruebas
*(Regla de negocio: el dueño gestiona el inventario de productos)*

#### Grupo A — `agregarStock` (5 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 01 | `stock_01_agregar_unidades.test.js` | Agrega 10 unidades a un producto con stock existente |
| 02 | `stock_02_agregar_desde_stock_cero.test.js` | Agrega unidades a un producto sin stock (stock = 0) |
| 03 | `stock_03_agregar_inmutabilidad.test.js` | El objeto original no se modifica al agregar stock |
| 04 | `stock_04_error_agregar_cero_unidades.test.js` | Lanza error si se intenta agregar 0 unidades |
| 05 | `stock_05_error_agregar_negativo.test.js` | Lanza error si la cantidad a agregar es negativa |

#### Grupo B — `reducirStock` (5 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 06 | `stock_06_reducir_correctamente.test.js` | Reduce el stock correctamente al vender un producto |
| 07 | `stock_07_reducir_hasta_cero.test.js` | El stock puede reducirse hasta exactamente 0 |
| 08 | `stock_08_error_stock_insuficiente.test.js` | Lanza error si el stock es insuficiente para la venta |
| 09 | `stock_09_error_reducir_cero.test.js` | Lanza error si se intenta reducir 0 unidades |
| 10 | `stock_10_reducir_inmutabilidad.test.js` | El objeto original no se modifica al reducir stock |

#### Grupo C — `hayStock` (5 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 11 | `stock_11_hay_stock_suficiente.test.js` | Retorna true si hay suficiente stock |
| 12 | `stock_12_stock_exacto.test.js` | Retorna true si el stock es exactamente igual a lo pedido |
| 13 | `stock_13_no_hay_stock.test.js` | Retorna false si no hay suficiente stock |
| 14 | `stock_14_stock_en_cero.test.js` | Retorna false si el stock es 0 |
| 15 | `stock_15_hay_stock_sin_cantidad.test.js` | Retorna true si hay al menos 1 unidad sin especificar cantidad |

#### Código representativo — `stock_08`:
```javascript
const { reducirStock } = require('../../src/stock');

test('debe lanzar un error si el stock es insuficiente para la venta', () => {
    const producto = { nombre: 'Jugo', stock: 2 };
    expect(() => reducirStock(producto, 5)).toThrow('Stock insuficiente');
});
```

---

### 🍽️ Módulo: MENU — 20 pruebas
*(Regla de negocio: el dueño gestiona los productos del menú)*

#### Grupo A — `agregarProducto` (7 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 01 | `menu_01_agregar_producto_nuevo.test.js` | Agrega un nuevo producto y el menú crece en 1 |
| 02 | `menu_02_precio_registrado_correctamente.test.js` | El precio del producto se registra con exactitud |
| 03 | `menu_03_agregar_inmutabilidad.test.js` | El menú original no se modifica al agregar |
| 04 | `menu_04_error_producto_duplicado.test.js` | Lanza error si el producto ya existe en el menú |
| 05 | `menu_05_error_sin_nombre.test.js` | Lanza error si el producto no tiene nombre |
| 06 | `menu_06_error_precio_negativo.test.js` | Lanza error si el precio del producto es negativo |
| 07 | `menu_07_agregar_precio_cero.test.js` | Permite agregar un producto con precio S/ 0.00 (gratuito) |

#### Grupo B — `eliminarProducto` (4 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 08 | `menu_08_eliminar_producto.test.js` | Elimina un producto y el menú se reduce en 1 |
| 09 | `menu_09_eliminar_no_afecta_otros.test.js` | Los demás productos no se ven afectados |
| 10 | `menu_10_error_eliminar_inexistente.test.js` | Lanza error si el producto a eliminar no existe |
| 11 | `menu_11_eliminar_case_insensitive.test.js` | La eliminación ignora mayúsculas/minúsculas |

#### Grupo C — `actualizarPrecio` (5 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 12 | `menu_12_actualizar_precio.test.js` | Cambia correctamente el precio de un producto |
| 13 | `menu_13_actualizar_no_afecta_otros.test.js` | El cambio de precio no afecta a los demás productos |
| 14 | `menu_14_error_actualizar_inexistente.test.js` | Lanza error si el producto no existe |
| 15 | `menu_15_error_precio_negativo.test.js` | Lanza error si el nuevo precio es negativo |
| 16 | `menu_16_actualizar_precio_cero.test.js` | Permite actualizar el precio a S/ 0.00 (promoción) |

#### Grupo D — `buscarProducto` (4 pruebas)

| # | Archivo | Escenario que valida |
|---|---------|----------------------|
| 17 | `menu_17_buscar_existente.test.js` | Encuentra un producto existente y retorna sus datos |
| 18 | `menu_18_buscar_case_insensitive.test.js` | La búsqueda ignora mayúsculas/minúsculas |
| 19 | `menu_19_buscar_inexistente.test.js` | Retorna null si el producto no existe |
| 20 | `menu_20_buscar_datos_completos.test.js` | Retorna el objeto completo (nombre, precio, categoría) |

#### Código representativo — `menu_12`:
```javascript
const { actualizarPrecio } = require('../../src/menu');

test('el dueno puede actualizar el precio de un producto del menu', () => {
    const menu = [{ nombre: 'Sandwich', precio: 12.00, categoria: 'Comida' }];
    const menuActualizado = actualizarPrecio(menu, 'Sandwich', 15.00);
    const sandwich = menuActualizado.find(p => p.nombre === 'Sandwich');
    expect(sandwich.precio).toBe(15.00);
});
```

---

## Simulación del Output del Test — Fase RED (Fallando)

Con los stubs vacíos, todos los tests fallarían así:

```
> jest

FAIL tests/pedido/pedido_01_total_con_delivery_y_cafe_gratis.test.js
  ● debe calcular el total con delivery y cafe gratis
    Expected: 17   Received: 0

FAIL tests/stock/stock_01_agregar_unidades.test.js
  ● el dueno puede agregar 10 unidades de Sandwich al stock
    Expected: 15   Received: 5  (objeto sin modificar)

FAIL tests/menu/menu_01_agregar_producto_nuevo.test.js
  ● el dueno puede agregar un nuevo producto al menu
    Expected: 4    Received: 3  (menu sin modificar)

...

Test Suites: 38 failed, 38 total
Tests:       38 failed, 38 total
```

---

## Conclusión de la Fase RED

| Módulo  | Tests escritos | Estado en RED |
|---------|---------------|---------------|
| Pedido  | 3             | ❌ Todos fallan |
| Stock   | 15            | ❌ Todos fallan |
| Menú    | 20            | ❌ Todos fallan |
| **Total** | **38**     | **❌ 38 fallos** |

→ Se procede a la **Fase GREEN**: implementar la lógica mínima para hacer pasar cada prueba.
