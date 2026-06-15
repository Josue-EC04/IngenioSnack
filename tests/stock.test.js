const { agregarStock, reducirStock, hayStock } = require('../src/stock');

describe('Gestión de Stock — Dueño de IngenioSnack', () => {

    // ── agregarStock ─────────────────────────────────────────────────────────

    describe('agregarStock', () => {

        test('el dueño puede agregar 10 unidades de Sándwich al stock', () => {
            const producto = { nombre: 'Sándwich', stock: 5 };
            const resultado = agregarStock(producto, 10);
            expect(resultado.stock).toBe(15);
        });

        test('el dueño puede agregar stock a un producto que tenía 0 unidades', () => {
            const producto = { nombre: 'Jugo de Naranja', stock: 0 };
            const resultado = agregarStock(producto, 20);
            expect(resultado.stock).toBe(20);
        });

        test('no debe modificar el objeto original al agregar stock (inmutabilidad)', () => {
            const producto = { nombre: 'Café', stock: 8 };
            agregarStock(producto, 5);
            expect(producto.stock).toBe(8); // El original no cambia
        });

        test('debe lanzar un error si se intenta agregar 0 unidades', () => {
            const producto = { nombre: 'Pastel', stock: 10 };
            expect(() => agregarStock(producto, 0)).toThrow('La cantidad a agregar debe ser mayor a 0');
        });

        test('debe lanzar un error si se intenta agregar una cantidad negativa', () => {
            const producto = { nombre: 'Empanada', stock: 10 };
            expect(() => agregarStock(producto, -5)).toThrow('La cantidad a agregar debe ser mayor a 0');
        });
    });

    // ── reducirStock ─────────────────────────────────────────────────────────

    describe('reducirStock', () => {

        test('el stock se reduce correctamente cuando se vende un producto', () => {
            const producto = { nombre: 'Café', stock: 10 };
            const resultado = reducirStock(producto, 3);
            expect(resultado.stock).toBe(7);
        });

        test('el stock puede reducirse hasta exactamente 0 unidades', () => {
            const producto = { nombre: 'Empanada', stock: 5 };
            const resultado = reducirStock(producto, 5);
            expect(resultado.stock).toBe(0);
        });

        test('debe lanzar un error si el stock es insuficiente para la venta', () => {
            const producto = { nombre: 'Jugo', stock: 2 };
            expect(() => reducirStock(producto, 5)).toThrow('Stock insuficiente');
        });

        test('debe lanzar un error si se intenta reducir 0 unidades', () => {
            const producto = { nombre: 'Sándwich', stock: 10 };
            expect(() => reducirStock(producto, 0)).toThrow('La cantidad a reducir debe ser mayor a 0');
        });

        test('no debe modificar el objeto original al reducir stock (inmutabilidad)', () => {
            const producto = { nombre: 'Pastel', stock: 8 };
            reducirStock(producto, 3);
            expect(producto.stock).toBe(8); // El original no cambia
        });
    });

    // ── hayStock ─────────────────────────────────────────────────────────────

    describe('hayStock', () => {

        test('retorna true si hay suficiente stock para atender el pedido', () => {
            const producto = { nombre: 'Café', stock: 5 };
            expect(hayStock(producto, 3)).toBe(true);
        });

        test('retorna true si el stock es exactamente igual a la cantidad solicitada', () => {
            const producto = { nombre: 'Sándwich', stock: 4 };
            expect(hayStock(producto, 4)).toBe(true);
        });

        test('retorna false si no hay suficiente stock para atender el pedido', () => {
            const producto = { nombre: 'Jugo', stock: 1 };
            expect(hayStock(producto, 3)).toBe(false);
        });

        test('retorna false si el stock es 0', () => {
            const producto = { nombre: 'Pastel', stock: 0 };
            expect(hayStock(producto)).toBe(false);
        });

        test('retorna true si no se especifica cantidad y hay al menos 1 unidad', () => {
            const producto = { nombre: 'Empanada', stock: 10 };
            expect(hayStock(producto)).toBe(true);
        });
    });
});
