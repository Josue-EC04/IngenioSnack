# Evidencia 1: Paso 2 - GREEN (Test Unitario Pasando)

## Regla de Negocio Elegida
*Calcular el total del pedido sumando el costo de los productos + S/ 5.00 de delivery, y aplicando el descuento si es el café gratis.*

## 1. Código de Negocio Mínimo para que Pase el Test

### Archivo: `src/pedido.js`
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

module.exports = { calcularTotal };
```

## 2. Captura de Pantalla del Test Pasando
*(Reemplaza la imagen de abajo con tu propia captura de pantalla de Jest en verde)*

![Test Unitario Pasando (Green)](./test_passing_green.png)

