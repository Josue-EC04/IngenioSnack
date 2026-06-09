const COSTO_DELIVERY = 5.00;

/**
 * Calcula el total de un pedido aplicando cargos de envío y descuentos especiales.
 * Cumple con el principio de diseño simple de XP (Código claro y expresivo).
 */
function calcularTotal(productos, opciones = {}) {
    const subtotal = calcularSubtotal(productos);
    const cargoDelivery = opciones.conDelivery ? COSTO_DELIVERY : 0;
    const descuento = opciones.cafeGratis ? obtenerDescuentoCafe(productos) : 0;
    
    return subtotal + cargoDelivery - descuento;
}

// Función auxiliar para sumar el precio de todos los productos (Legibilidad)
function calcularSubtotal(productos) {
    return productos.reduce((total, prod) => total + prod.precio, 0);
}

// Función auxiliar para buscar y descontar el precio de un café (Responsabilidad única)
function obtenerDescuentoCafe(productos) {
    const cafe = productos.find(prod => prod.nombre.toLowerCase() === 'café' || prod.nombre.toLowerCase() === 'cafe');
    return cafe ? cafe.precio : 0;
}

module.exports = { calcularTotal };
