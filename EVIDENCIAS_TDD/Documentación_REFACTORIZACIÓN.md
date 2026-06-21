# Informe Técnico de Refactorización — Metodología XP

**Módulos Afectados:** `cart.js` (Cálculo de Totales) y `stock.js` (Gestión de Inventario)  
**Metodología:** Programación Extrema (XP) — Diseño Evolutivo y Refactorización Continua  
**Tecnología:** JavaScript (ECMAScript 2015+)

---

## Refactorización de `cart.js` (Cálculo de Totales)

### Matriz de Cambios: Antes vs. Después

| Criterio | Diseño Original (Antes) | Diseño Refactorizado (Después) |
| :--- | :--- | :--- |
| **Estructura** | Función monolítica (`calcularTotal`) encargada de la sumatoria, lógica de delivery y descuentos. | Aplicación de **Responsabilidad Única**. Funciones atómicas auxiliares: `calcularSubtotal` y `obtenerDescuentoCafe`. |
| **Procesamiento** | Uso imperativo de bucles tradicionales `for (let i = 0; ...)` controlados manualmente. | Enfoque declarativo usando métodos nativos (`.reduce()` para sumatorias y `.find()` para búsquedas). |
| **Robustez** | Comparación estricta de strings (`=== 'Café'`), vulnerable a errores de tildes o caja (mayúsculas/minúsculas). | Normalización con `.toLowerCase()` y soporte para alternativas ortográficas comunes (`'café'` / `'cafe'`). |
| **Números Mágicos** | Valor de delivery quemado (`5.00`) dentro del flujo lógico condicional. | Extracción a una constante global declarativa e inmutable (`const COSTO_DELIVERY = 5.00;`). |
| **Seguridad** | Riesgo de excepción crítica por desreferenciación si el argumento `opciones` no se enviaba. | Inclusión de un objeto vacío por defecto en los parámetros de la firma (`opciones = {}`). |

---

## Refactorización de `stock.js` (Módulo de Inventario)

### Matriz de Cambios: Antes vs. Después

| Criterio | Diseño Original (Antes) | Diseño Refactorizado (Después) |
| :--- | :--- | :--- |
| **Integridad de Datos**| Retorno de objetos construidos manualmente, propenso a perder propiedades si el modelo de producto evoluciona. | Uso de **Spread Operator (`...producto`)** para clonar dinámicamente todos los atributos nativos del objeto. |
| **Manejo de Parámetros**| Evaluación e inicialización manual del argumento en el cuerpo de la función (`if (cantidad === undefined)`). | Inicialización limpia mediante valores por defecto en la firma de la función nativa de ES6 (`cantidad = 1`). |
| **Interpolación** | Concatenación clásica de caracteres legibles mediante el operador aritmético tradicional (`+`). | Implementación de **Template Literals** (comillas invertidas y `${}`), optimizando la lectura y mantenimiento. |
| **Simetría Operativa** | Módulo incompleto enfocado únicamente en la reducción del inventario. | Adición de la función pura complementaria `agregarStock` bajo los mismos estándares de calidad de software. |

---

## Conclusión
Al aislar la lógica de negocio en funciones puras y atómicas, el diseño resultante no solo es más legible, sino que promueve la práctica de **Pruebas Unitarias (Unit Testing)** bajo XP. El desacoplamiento logrado reduce el riesgo de efectos secundarios y prepara la base de código para una integración continua y segura.
