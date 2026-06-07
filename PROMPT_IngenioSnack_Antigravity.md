# 🧠 PROMPT MAESTRO PARA ANTIGRAVITY
## Sistema Web: **IngenioSnack** — Cafetería Digital de la UNCP
### Iteración 1 — MVP Ágil

---

## 📌 INSTRUCCIÓN PRINCIPAL

Eres un desarrollador full-stack experto. Debes crear una **aplicación web completa y funcional** para la cafetería "IngenioSnack" de la Facultad de Ingeniería de Sistemas de la UNCP (Huancayo, Perú). El sistema permite que los estudiantes realicen pedidos desde su celular antes de bajar al recreo, y que el dueño administre el menú y vea reportes de ventas. Crea todo el código necesario: frontend, backend y base de datos.

---

## 🎯 PROBLEMA A RESOLVER

Durante el recreo de 1 hora, se forman largas filas en la cafetería. Los estudiantes pierden tiempo o se van a otra cafetería. El dueño (Sr. Julio) atiende solo con una libreta de papel, pierde ventas y no tiene visibilidad de su negocio. La solución es un sistema de pedidos anticipados por celular con pago contra entrega.

---

## 👥 ROLES DEL SISTEMA

### ROL 1: ESTUDIANTE (Cliente)
- Se registra con su nombre, correo institucional y código de estudiante
- Navega el menú disponible
- Agrega productos al carrito
- Realiza su pedido (recoge en tienda, pago contra entrega)
- Ve el estado de su pedido en tiempo real
- Acumula puntos de fidelidad

### ROL 2: ADMINISTRADOR (Sr. Julio — Dueño)
- Gestiona el menú (agregar, editar, desactivar productos)
- Ve todos los pedidos entrantes en tiempo real
- Cambia el estado de los pedidos (Recibido → En preparación → Listo para recoger)
- Ve reportes de ventas
- Gestiona el sistema de fidelización

---

## 📋 HISTORIAS DE USUARIO — ITERACIÓN 1

### HU-01: Registro e Inicio de Sesión
**Como** estudiante,
**Quiero** registrarme con mi correo y contraseña,
**Para** poder realizar pedidos y acumular puntos.

**Criterios de aceptación:**
- Formulario de registro: nombre completo, correo, código de estudiante, contraseña
- Login con correo + contraseña
- Sesión persistente (no cerrar sesión al recargar)
- Página de inicio de sesión del admin separada (ruta `/admin/login`)

---

### HU-02: Ver Menú Disponible
**Como** estudiante,
**Quiero** ver todos los productos disponibles con foto, nombre y precio,
**Para** elegir qué pedir.

**Criterios de aceptación:**
- Mostrar solo productos activos (con stock > 0)
- Mostrar categorías: Sándwiches, Bebidas, Snacks
- Mostrar precio en soles peruanos (S/)
- Si un producto no tiene ingredientes disponibles, mostrarlo como "Agotado" en gris (no se puede agregar al carrito)
- Mostrar foto o imagen representativa de cada producto

---

### HU-03: Realizar un Pedido
**Como** estudiante,
**Quiero** agregar productos al carrito y confirmar mi pedido,
**Para** que esté listo cuando baje al recreo.

**Criterios de aceptación:**
- Carrito de compras accesible desde cualquier pantalla
- Mostrar subtotal actualizado en tiempo real
- Botón "Confirmar Pedido" → genera número de pedido único (ej: #0042)
- Mostrar resumen del pedido: productos, cantidades, total, número de pedido
- Pago: SOLO contra entrega (no integración bancaria en esta iteración)
- Mensaje de confirmación: "Tu pedido #0042 está siendo preparado. Recógelo en la cafetería."
- Validar stock antes de confirmar: si un producto se agotó entre que lo agregó al carrito y confirmó, mostrar alerta y removerlo del carrito

---

### HU-04: Seguimiento del Pedido en Tiempo Real
**Como** estudiante,
**Quiero** ver el estado de mi pedido desde mi celular,
**Para** saber exactamente cuándo está listo para recoger.

**Criterios de aceptación:**
- Estados visibles con íconos: 🕐 Recibido → 👨‍🍳 En preparación → ✅ Listo para recoger → 📦 Entregado
- Actualización automática cada 10 segundos (polling) o en tiempo real (WebSocket si es posible)
- Notificación visual cuando el estado cambia a "Listo para recoger"
- Historial de pedidos anteriores del estudiante

---

### HU-05: Gestión del Menú (Admin)
**Como** administrador,
**Quiero** agregar, editar y desactivar productos del menú rápidamente,
**Para** reflejar la disponibilidad real de ingredientes.

**Criterios de aceptación:**
- Formulario para crear producto: nombre, descripción, precio, categoría, imagen (URL o subida), stock (cantidad disponible)
- Editar cualquier campo de un producto existente
- Botón toggle "Activar/Desactivar" producto (sin eliminar)
- Campo de stock: cuando llega a 0, el producto se marca automáticamente como agotado
- Reducir stock automáticamente al confirmar un pedido

---

### HU-06: Gestión de Pedidos (Admin)
**Como** administrador,
**Quiero** ver todos los pedidos en tiempo real y cambiar su estado,
**Para** organizar la preparación y entrega.

**Criterios de aceptación:**
- Panel con lista de pedidos del día actual
- Cada pedido muestra: número, nombre del estudiante, productos pedidos, total, hora del pedido, estado actual
- Botones para cambiar estado: [En Preparación] → [Listo] → [Entregado]
- Pedidos ordenados por hora (más reciente primero)
- Filtro por estado (Todos / Pendientes / En preparación / Listos)
- Contador de pedidos pendientes visible siempre en la barra del admin

---

### HU-07: Sistema de Fidelización — "Café de la Lealtad"
**Como** estudiante,
**Quiero** acumular puntos por cada sándwich que compro,
**Para** ganarme un café americano gratis cada 10 sándwiches.

**Criterios de aceptación:**
- Cada sándwich comprado y entregado suma 1 punto de lealtad
- Al acumular 10 puntos → el sistema genera automáticamente 1 cupón de "Café Americano Gratis"
- El cupón se muestra en el perfil del estudiante con un código único (ej: CAFE-2024-XK7)
- Al presentar el código en caja, el admin puede marcarlo como "Canjeado"
- Mostrar progreso: "Llevas 7/10 sándwiches para tu próximo café gratis" con barra de progreso
- Los puntos solo se acumulan con sándwiches de la categoría "Sándwiches", no con bebidas ni snacks

---

### HU-08: Reporte de Ventas (Admin)
**Como** administrador,
**Quiero** ver qué productos se venden más en días de examen y en general,
**Para** preparar stock adecuado.

**Criterios de aceptación:**
- Gráfico de barras: Top 5 productos más vendidos (por cantidad de unidades)
- Filtro por rango de fechas (hoy, esta semana, este mes, rango personalizado)
- Tabla con: producto, unidades vendidas, ingresos generados
- Total de ingresos del período seleccionado
- Indicador de "Día de mayor venta" del período
- Exportar reporte como PDF o imprimir (opcional, si es posible)

---

## 🗄️ MODELO DE BASE DE DATOS

### Tabla: `users`
```
id, nombre, correo, codigo_estudiante, password_hash, rol (estudiante/admin), 
puntos_fidelidad, created_at
```

### Tabla: `productos`
```
id, nombre, descripcion, precio, categoria (sandwiches/bebidas/snacks), 
imagen_url, stock, activo (boolean), created_at, updated_at
```

### Tabla: `pedidos`
```
id, numero_pedido (autoincremental formateado), user_id, 
estado (recibido/preparando/listo/entregado), total, 
metodo_pago (contra_entrega), created_at, updated_at
```

### Tabla: `detalle_pedidos`
```
id, pedido_id, producto_id, cantidad, precio_unitario, subtotal
```

### Tabla: `cupones_fidelidad`
```
id, user_id, codigo, tipo (cafe_americano), canjeado (boolean), 
fecha_generacion, fecha_canje
```

### Tabla: `historial_puntos`
```
id, user_id, pedido_id, puntos_ganados, descripcion, created_at
```

---

## 🎨 DISEÑO Y UI/UX

### Paleta de colores
- **Primario:** Marrón café oscuro `#3E1F00`
- **Secundario:** Naranja tostado `#FF6B35`
- **Acento:** Amarillo dorado `#FFD700`
- **Fondo claro:** `#FFF8F0`
- **Texto:** `#1A1A1A`
- **Éxito:** `#28A745`
- **Error:** `#DC3545`

### Estilo visual
- Estilo cálido, amigable, relacionado con cafetería artesanal
- Íconos relacionados a comida (usar emojis o íconos de Lucide/Heroicons)
- Responsive: diseñado primero para móvil (mobile-first) ya que los estudiantes usan celular
- Tipografía: Display bold para títulos, sans-serif legible para cuerpo
- Tarjetas con sombra suave para productos
- Barra de navegación inferior en móvil (Home, Menú, Mi Pedido, Perfil)

### Pantallas requeridas — ESTUDIANTE
1. **Login / Registro**
2. **Home** — Bienvenida, pedido activo si existe, acceso rápido al menú
3. **Menú** — Grid de productos por categoría, con filtros
4. **Carrito** — Lista de productos, totales, botón confirmar
5. **Seguimiento de Pedido** — Estado en tiempo real, número de pedido
6. **Perfil** — Puntos de fidelidad, barra de progreso, cupones, historial

### Pantallas requeridas — ADMIN
1. **Login Admin** (`/admin/login`)
2. **Dashboard** — Resumen del día (pedidos, ingresos, productos agotados)
3. **Pedidos en Vivo** — Lista con botones de cambio de estado
4. **Gestión de Menú** — CRUD de productos
5. **Reportes** — Gráficos y tablas de ventas
6. **Fidelización** — Validar y canjear cupones

---

## ⚙️ STACK TÉCNICO RECOMENDADO

### Opción A — Full Stack JS (Recomendado para rapidez)
- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express.js
- **Base de datos:** PostgreSQL o SQLite (para MVP)
- **Auth:** JWT (JSON Web Tokens)
- **Tiempo real:** Socket.io o polling cada 10s
- **ORM:** Prisma o Sequelize

### Opción B — Si Antigravity usa otro stack
- Adaptar según las capacidades del generador
- Prioridad: que sea funcional, responsive y seguro
- Base de datos relacional obligatoria (no solo localStorage)

---

## 🔒 REGLAS DE NEGOCIO CRÍTICAS

1. **Stock en tiempo real:** Al confirmar pedido → descontar stock inmediatamente. Si stock = 0 → producto aparece como "Agotado" en el menú.
2. **Validación doble de stock:** Validar al agregar al carrito Y al confirmar el pedido (pueden pasar minutos entre ambas acciones).
3. **Alerta de producto agotado:** Si entre agregar al carrito y confirmar el pedido el producto se agota → mostrar mensaje claro: "Lo sentimos, [Producto] ya no está disponible. Ha sido removido de tu carrito."
4. **Pago solo contra entrega:** No hay integración con pasarelas de pago en esta iteración. El admin marca como "Entregado" al recibir el dinero físicamente.
5. **Puntos de fidelidad:** Solo se suman cuando el pedido llega al estado "Entregado" (no al hacer el pedido).
6. **Cupón automático:** Al llegar a múltiplos de 10 puntos (10, 20, 30...) → generar cupón automáticamente.
7. **El admin no puede pedir:** El usuario con rol admin no ve la sección de menú ni carrito de cliente.
8. **Número de pedido:** Formato legible: #0001, #0002... (no usar UUID largo para facilitar comunicación verbal en caja).

---

## 📱 FLUJO PRINCIPAL DEL SISTEMA

```
ESTUDIANTE:
[Registro/Login] → [Ver Menú] → [Agregar al Carrito] → 
[Confirmar Pedido] → [Ver Estado en Tiempo Real] → 
[Recoger en Caja y Pagar] → [Puntos Acumulados]

ADMIN:
[Login Admin] → [Ver Dashboard] → [Ver Pedidos Nuevos] → 
[Cambiar Estado: Preparando → Listo] → [Marcar como Entregado] → 
[Gestionar Menú si hay cambios] → [Ver Reportes]
```

---

## 🚀 DATOS DE PRUEBA (SEED DATA)

Al inicializar la base de datos, incluir:

### Productos de ejemplo:
| Nombre | Categoría | Precio | Stock |
|--------|-----------|--------|-------|
| Sándwich de Pollo | sándwiches | S/ 4.50 | 20 |
| Sándwich Mixto | sándwiches | S/ 3.50 | 15 |
| Sándwich de Jamón y Queso | sándwiches | S/ 4.00 | 18 |
| Café Americano | bebidas | S/ 2.00 | 50 |
| Café con Leche | bebidas | S/ 2.50 | 40 |
| Agua San Luis 625ml | bebidas | S/ 1.50 | 30 |
| Galletas Oreo | snacks | S/ 1.00 | 25 |
| Chifles | snacks | S/ 1.50 | 20 |
| Keke | snacks | S/ 2.00 | 10 |

### Usuario Admin inicial:
- Correo: `julio@ingeniosnack.pe`
- Contraseña: `admin123` (debe ser cambiada en producción)

### Usuario Estudiante de prueba:
- Nombre: Ana García
- Correo: `ana.garcia@uncp.edu.pe`
- Código: `2021100123`
- Contraseña: `estudiante123`

---

## ✅ CRITERIOS DE ÉXITO DEL MVP

- [ ] Un estudiante puede registrarse, ver el menú y hacer un pedido en menos de 2 minutos
- [ ] El admin ve el pedido nuevo en menos de 15 segundos
- [ ] El admin puede cambiar el estado del pedido y el estudiante lo ve actualizado
- [ ] Si un producto se agota, desaparece del menú o muestra "Agotado" automáticamente
- [ ] El sistema de puntos suma correctamente al marcar como "Entregado"
- [ ] El cupón de café gratis se genera automáticamente al acumular 10 puntos
- [ ] Los reportes muestran datos reales de ventas con gráficos
- [ ] La aplicación es completamente usable desde un celular (responsive)

---

## 📝 NOTAS ADICIONALES PARA EL DESARROLLADOR

- **Prioridad:** Funcionalidad > Estética. Que funcione correctamente primero.
- **Lenguaje:** Todo en español (interfaz, mensajes de error, notificaciones).
- **Moneda:** Soles peruanos (S/)
- **Zona horaria:** América/Lima (UTC-5)
- **No implementar en Iteración 1:** Pagos online, delivery, múltiples sucursales, chat, valoraciones/reseñas
- **Seguridad básica:** Contraseñas hasheadas (bcrypt), rutas de admin protegidas por JWT, validación de inputs en frontend y backend
- **Manejo de errores:** Mensajes de error claros y amigables en español para el usuario final

---

*Documento generado para el curso de Ingeniería de Software — UNCP*
*Metodología: Desarrollo Ágil (XP / Scrum) — Iteración 1*
*Cliente: Sr. Julio — Cafetería IngenioSnack*
