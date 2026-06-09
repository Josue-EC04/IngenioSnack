# Documento de Refactorización

## Refactorizaciones Realizadas

### 1. Refactorización de la función `calcularTotal` (Cálculo del Total del Pedido)
- **Antes (Código Complejo con bucles for redundantes y variables mutables):**
  ```javascript
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
  ```
- **Después (Código Limpio y Expresivo / Diseño Simple de XP):**
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
- **Principio de diseño aplicado:**
  - **Diseño Simple (XP):** El código ahora expresa claramente su intención sin comentarios innecesarios.
  - **SRP (Single Responsibility Principle):** Se dividió la lógica compleja en pequeñas funciones auxiliares enfocadas (`calcularSubtotal`, `obtenerDescuentoCafe`).
  - **Evitar bucles anidados/mutabilidad:** Se reemplazaron los bucles imperativos `for` por métodos declarativos (`.reduce()` y `.find()`).

