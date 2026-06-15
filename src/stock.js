const STOCK_MINIMO = 0;

/**
 * Agrega unidades al stock de un producto.
 * @param {Object} producto - Producto con nombre y stock actual.
 * @param {number} cantidad - Unidades a agregar.
 * @returns {Object} Producto con stock actualizado.
 */
function agregarStock(producto, cantidad) {
    if (cantidad <= 0) {
        throw new Error('La cantidad a agregar debe ser mayor a 0');
    }
    return { ...producto, stock: producto.stock + cantidad };
}

/**
 * Reduce el stock de un producto al venderse una unidad.
 * @param {Object} producto - Producto con nombre y stock actual.
 * @param {number} cantidad - Unidades vendidas.
 * @returns {Object} Producto con stock actualizado.
 */
function reducirStock(producto, cantidad) {
    if (cantidad <= 0) {
        throw new Error('La cantidad a reducir debe ser mayor a 0');
    }
    if (producto.stock - cantidad < STOCK_MINIMO) {
        throw new Error(`Stock insuficiente. Stock actual: ${producto.stock}, solicitado: ${cantidad}`);
    }
    return { ...producto, stock: producto.stock - cantidad };
}

/**
 * Verifica si un producto tiene stock disponible para una cantidad dada.
 * @param {Object} producto - Producto con nombre y stock actual.
 * @param {number} cantidad - Cantidad requerida.
 * @returns {boolean} true si hay stock suficiente, false si no.
 */
function hayStock(producto, cantidad = 1) {
    return producto.stock >= cantidad;
}

module.exports = { agregarStock, reducirStock, hayStock };
