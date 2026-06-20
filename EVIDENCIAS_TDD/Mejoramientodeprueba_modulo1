// ==========================================
// CONFIGURACIÓN Y CONSTANTES DE NEGOCIO
// ==========================================
const CONFIG_REGLAS = {
    COSTO_DELIVERY: 5.00,
    PRODUCTO_RECOMPENSA: 'cafe'
};

// ==========================================
// FUNCIONES UTILITARIAS PURAS (Helpers)
// ==========================================

/**
 * Normaliza un string eliminando espacios, tildes y pasándolo a minúsculas.
 */
const normalizarTexto = (texto) => 
    String(texto || '').trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/**
 * Calcula la suma aritmética base de un arreglo de productos.
 */
const calcularSubtotal = (productos) => 
    productos.reduce((acumulado, prod) => acumulado + (Number(prod?.precio) || 0), 0);

/**
 * Localiza el precio del primer producto de recompensa que califique en la lista.
 */
const obtenerDescuentoPorRecompensa = (productos, nombreBuscado) => {
    const productoEncontrado = productos.find(prod => normalizarTexto(prod?.nombre) === normalizarTexto(nombreBuscado));
    return productoEncontrado ? (Number(productoEncontrado.precio) || 0) : 0;
};

// ==========================================
// FUNCIÓN PRINCIPAL (Punto de Entrada)
// ==========================================

/**
 * Orquestador del cálculo total del pedido.
 * Sigue una estructura declarativa de alta legibilidad.
 */
function calcularTotal(productos = [], opciones = {}) {
    // Defensa perimetral contra tipos de datos inválidos
    if (!Array.isArray(productos)) return 0;

    let total = calcularSubtotal(productos);

    // Regla de Negocio 1: Cargo por envío
    if (opciones.conDelivery) {
        total += CONFIG_REGLAS.COSTO_DELIVERY;
    }

    // Regla de Negocio 2: Beneficio de fidelidad (HU03)
    if (opciones.cafeGratis) {
        total -= obtenerDescuentoPorRecompensa(productos, CONFIG_REGLAS.PRODUCTO_RECOMPENSA);
    }

    return total;
}
