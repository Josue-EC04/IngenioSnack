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

### 2. Refactorización del módulo `stock.js` (Gestión de Inventario)
- **Antes (GREEN — Código con valores por defecto manuales y mutación implícita):**
  ```javascript
  function hayStock(producto, cantidad) {
      if (cantidad === undefined) cantidad = 1; // Manejo manual del default
      return producto.stock >= cantidad;
  }

  function reducirStock(producto, cantidad) {
      if (cantidad <= 0) throw new Error('La cantidad a reducir debe ser mayor a 0');
      if (producto.stock - cantidad < 0) {
          // Error message con concatenación:
          throw new Error('Stock insuficiente. Stock actual: ' + producto.stock + ', solicitado: ' + cantidad);
      }
      return { nombre: producto.nombre, stock: producto.stock - cantidad }; 
  }
  ```
- **Después (REFACTOR — Código limpio con spread operator y defaults de JS):**
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
  ```
- **Principio de diseño aplicado:**
  - **Inmutabilidad:** Uso de Spread operator (`...producto`) para no mutar ni perder propiedades del objeto original.
  - **Eliminación de Magic Numbers:** Uso de `STOCK_MINIMO`.
  - **Legibilidad:** Uso de Template Literals en lugar de concatenación con `+`.

### 3. Refactorización del módulo `menu.js` (Gestión del Menú)
- **Antes (GREEN — Bucles `for` verbosos e if anidados):**
  ```javascript
  function agregarProducto(menu, nuevoProducto) {
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
- **Después (REFACTOR — Código declarativo y expresivo):**
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
      return menu.filter(p => p.nombre.toLowerCase() !== nombre.toLowerCase()); 
  }

  function actualizarPrecio(menu, nombre, nuevoPrecio) {
      if (nuevoPrecio < 0) throw new Error('El precio no puede ser negativo');
      const existe = menu.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
      if (!existe) throw new Error(`El producto "${nombre}" no existe en el menu`);
      return menu.map(p =>                                                  
          p.nombre.toLowerCase() === nombre.toLowerCase()
              ? { ...p, precio: nuevoPrecio }
              : p
      );
  }

  function buscarProducto(menu, nombre) {
      return menu.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) || null;
  }
  ```
- **Principio de diseño aplicado:**
  - **Programación Declarativa:** Reemplazo completo de bucles `for` por funciones de orden superior en arrays (`.some()`, `.filter()`, `.map()`, `.find()`).
  - **Inmutabilidad de Arrays:** Creación de un nuevo arreglo al agregar usando spread (`[...menu, nuevoProducto]`).
  - **Diseño Simple (XP):** Minimización de la carga cognitiva y líneas de código.
