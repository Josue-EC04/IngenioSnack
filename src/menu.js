/**
 * Agrega un nuevo producto al menú.
 * @param {Array} menu - Lista actual de productos del menú.
 * @param {Object} nuevoProducto - Producto a agregar (nombre, precio, categoria).
 * @returns {Array} Nuevo menú con el producto agregado.
 */
function agregarProducto(menu, nuevoProducto) {
    if (!nuevoProducto.nombre || nuevoProducto.nombre.trim() === '') {
        throw new Error('El producto debe tener un nombre');
    }
    if (nuevoProducto.precio == null || nuevoProducto.precio < 0) {
        throw new Error('El precio del producto no puede ser negativo');
    }
    const yaExiste = menu.some(
        p => p.nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase()
    );
    if (yaExiste) {
        throw new Error(`El producto "${nuevoProducto.nombre}" ya existe en el menu`);
    }
    return [...menu, nuevoProducto];
}

/**
 * Elimina un producto del menú por su nombre.
 * @param {Array} menu - Lista actual de productos del menú.
 * @param {string} nombre - Nombre del producto a eliminar.
 * @returns {Array} Nuevo menú sin el producto.
 */
function eliminarProducto(menu, nombre) {
    const existe = menu.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (!existe) {
        throw new Error(`El producto "${nombre}" no existe en el menu`);
    }
    return menu.filter(p => p.nombre.toLowerCase() !== nombre.toLowerCase());
}

/**
 * Actualiza el precio de un producto del menú.
 * @param {Array} menu - Lista actual de productos del menú.
 * @param {string} nombre - Nombre del producto a actualizar.
 * @param {number} nuevoPrecio - Nuevo precio del producto.
 * @returns {Array} Nuevo menú con el precio actualizado.
 */
function actualizarPrecio(menu, nombre, nuevoPrecio) {
    if (nuevoPrecio < 0) {
        throw new Error('El precio no puede ser negativo');
    }
    const existe = menu.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (!existe) {
        throw new Error(`El producto "${nombre}" no existe en el menu`);
    }
    return menu.map(p =>
        p.nombre.toLowerCase() === nombre.toLowerCase()
            ? { ...p, precio: nuevoPrecio }
            : p
    );
}

/**
 * Busca un producto en el menú por nombre.
 * @param {Array} menu - Lista de productos del menú.
 * @param {string} nombre - Nombre a buscar.
 * @returns {Object|null} Producto encontrado o null si no existe.
 */
function buscarProducto(menu, nombre) {
    return menu.find(p => p.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

module.exports = { agregarProducto, eliminarProducto, actualizarPrecio, buscarProducto };
