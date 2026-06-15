const { agregarProducto, eliminarProducto, actualizarPrecio, buscarProducto } = require('../src/menu');

// Menú de prueba reutilizable para cada test
const menuInicial = [
    { nombre: 'Sándwich', precio: 12.00, categoria: 'Comida' },
    { nombre: 'Café', precio: 6.00, categoria: 'Bebidas' },
    { nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' },
];

describe('Gestión del Menú — Dueño de IngenioSnack', () => {

    // ── agregarProducto ───────────────────────────────────────────────────────

    describe('agregarProducto', () => {

        test('el dueño puede agregar un nuevo producto al menú', () => {
            const nuevoProducto = { nombre: 'Empanada', precio: 5.00, categoria: 'Comida' };
            const menuActualizado = agregarProducto(menuInicial, nuevoProducto);
            expect(menuActualizado).toHaveLength(4);
            expect(menuActualizado[3].nombre).toBe('Empanada');
        });

        test('el precio del nuevo producto se registra correctamente', () => {
            const nuevoProducto = { nombre: 'Pastel de Choclo', precio: 9.50, categoria: 'Comida' };
            const menuActualizado = agregarProducto(menuInicial, nuevoProducto);
            const productoBuscado = menuActualizado.find(p => p.nombre === 'Pastel de Choclo');
            expect(productoBuscado.precio).toBe(9.50);
        });

        test('no debe modificar el menú original al agregar un producto (inmutabilidad)', () => {
            const nuevoProducto = { nombre: 'Torta', precio: 7.00, categoria: 'Postres' };
            agregarProducto(menuInicial, nuevoProducto);
            expect(menuInicial).toHaveLength(3); // El menú original sigue con 3 productos
        });

        test('debe lanzar un error si se intenta agregar un producto ya existente', () => {
            const duplicado = { nombre: 'Café', precio: 6.00, categoria: 'Bebidas' };
            expect(() => agregarProducto(menuInicial, duplicado)).toThrow('ya existe en el menú');
        });

        test('debe lanzar un error si el producto no tiene nombre', () => {
            const sinNombre = { nombre: '', precio: 5.00, categoria: 'Comida' };
            expect(() => agregarProducto(menuInicial, sinNombre)).toThrow('El producto debe tener un nombre');
        });

        test('debe lanzar un error si el precio del producto es negativo', () => {
            const precioNegativo = { nombre: 'Bebida Gratis', precio: -1.00, categoria: 'Bebidas' };
            expect(() => agregarProducto(menuInicial, precioNegativo)).toThrow('precio del producto no puede ser negativo');
        });

        test('se puede agregar un producto con precio S/ 0.00 (producto gratuito)', () => {
            const productoGratis = { nombre: 'Vaso de Agua', precio: 0, categoria: 'Bebidas' };
            const menuActualizado = agregarProducto(menuInicial, productoGratis);
            expect(menuActualizado).toHaveLength(4);
        });
    });

    // ── eliminarProducto ──────────────────────────────────────────────────────

    describe('eliminarProducto', () => {

        test('el dueño puede eliminar un producto del menú', () => {
            const menuActualizado = eliminarProducto(menuInicial, 'Café');
            expect(menuActualizado).toHaveLength(2);
            expect(menuActualizado.find(p => p.nombre === 'Café')).toBeUndefined();
        });

        test('la eliminación no afecta a los otros productos del menú', () => {
            const menuActualizado = eliminarProducto(menuInicial, 'Café');
            expect(menuActualizado.find(p => p.nombre === 'Sándwich')).toBeDefined();
            expect(menuActualizado.find(p => p.nombre === 'Jugo de Naranja')).toBeDefined();
        });

        test('debe lanzar un error si el producto a eliminar no existe', () => {
            expect(() => eliminarProducto(menuInicial, 'Pizza')).toThrow('no existe en el menú');
        });

        test('la eliminación no distingue entre mayúsculas y minúsculas', () => {
            const menuActualizado = eliminarProducto(menuInicial, 'café'); // minúsculas
            expect(menuActualizado.find(p => p.nombre === 'Café')).toBeUndefined();
        });
    });

    // ── actualizarPrecio ──────────────────────────────────────────────────────

    describe('actualizarPrecio', () => {

        test('el dueño puede actualizar el precio de un producto del menú', () => {
            const menuActualizado = actualizarPrecio(menuInicial, 'Sándwich', 15.00);
            const sandwichActualizado = menuActualizado.find(p => p.nombre === 'Sándwich');
            expect(sandwichActualizado.precio).toBe(15.00);
        });

        test('actualizar el precio de un producto no afecta a los otros', () => {
            const menuActualizado = actualizarPrecio(menuInicial, 'Café', 7.50);
            const jugo = menuActualizado.find(p => p.nombre === 'Jugo de Naranja');
            expect(jugo.precio).toBe(8.00); // El jugo sigue igual
        });

        test('debe lanzar un error si el producto no existe en el menú', () => {
            expect(() => actualizarPrecio(menuInicial, 'Hamburguesa', 20.00)).toThrow('no existe en el menú');
        });

        test('debe lanzar un error si el nuevo precio es negativo', () => {
            expect(() => actualizarPrecio(menuInicial, 'Café', -3.00)).toThrow('El precio no puede ser negativo');
        });

        test('se puede actualizar el precio a S/ 0.00 (para promoción gratuita)', () => {
            const menuActualizado = actualizarPrecio(menuInicial, 'Café', 0);
            const cafe = menuActualizado.find(p => p.nombre === 'Café');
            expect(cafe.precio).toBe(0);
        });
    });

    // ── buscarProducto ────────────────────────────────────────────────────────

    describe('buscarProducto', () => {

        test('el dueño puede encontrar un producto del menú por su nombre', () => {
            const producto = buscarProducto(menuInicial, 'Café');
            expect(producto).not.toBeNull();
            expect(producto.precio).toBe(6.00);
        });

        test('la búsqueda no distingue entre mayúsculas y minúsculas', () => {
            const producto = buscarProducto(menuInicial, 'sándwich');
            expect(producto).not.toBeNull();
            expect(producto.nombre).toBe('Sándwich');
        });

        test('retorna null si el producto no existe en el menú', () => {
            const producto = buscarProducto(menuInicial, 'Hamburguesa');
            expect(producto).toBeNull();
        });

        test('la búsqueda devuelve todos los datos del producto (nombre, precio, categoría)', () => {
            const producto = buscarProducto(menuInicial, 'Jugo de Naranja');
            expect(producto).toEqual({ nombre: 'Jugo de Naranja', precio: 8.00, categoria: 'Bebidas' });
        });
    });
});
