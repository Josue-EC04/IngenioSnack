# Tarjetas CRC — IngenioSnack

Este documento contiene el diseño de clases y componentes del sistema web **IngenioSnack** mediante la técnica de **Tarjetas CRC (Clase-Responsabilidad-Colaborador)**, como parte de la aplicación de la metodología ágil **Extreme Programming (XP)**.

---

## 1. Clase: Usuario (User)

**Descripción:** Representa a los actores que interactúan con el sistema (estudiantes y personal administrativo de la UNCP).

| **Clase:** `Usuario` (User) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Almacenar credenciales e información de perfil (nombre, correo, rol). | |
| - Registrar y consultar el código universitario único. | |
| - Mantener el saldo actual de puntos de fidelidad acumulados. | `HistorialPuntos` |
| - Realizar solicitudes de nuevos pedidos. | `Pedido` |
| - Canjear cupones de descuento/regalo. | `CuponFidelidad` |

---

## 2. Clase: Producto (Product)

**Descripción:** Representa los artículos comestibles y bebidas que se ofrecen en el menú de la cafetería digital.

| **Clase:** `Producto` (Producto) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Registrar nombre, descripción, categoría (sandwiches, bebidas, snacks) y precio. | |
| - Controlar y descontar existencias en el inventario (*stock*). | `DetallePedido` |
| - Permitir la desactivación o activación lógica del menú. | |

---

## 3. Clase: Pedido (Order)

**Descripción:** Gestiona las transacciones de compra, estados y el cálculo del total de la compra.

| **Clase:** `Pedido` (Pedido) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Generar un número de pedido único y rastreable. | |
| - Registrar el estado de preparación (`recibido`, `preparando`, `listo`, `entregado`). | `NotificadorSocket` |
| - Calcular el total del importe considerando el subtotal de ítems y promociones. | `DetallePedido`, `Producto` |
| - Registrar la asociación del usuario que ordenó. | `Usuario` |
| - Consumir un cupón de fidelidad si aplica descuento. | `CuponFidelidad` |
| - Registrar la ganancia de puntos correspondientes por la compra. | `HistorialPuntos` |

---

## 4. Clase: DetallePedido (OrderItem)

**Descripción:** Clase asociativa que desglosa cada producto, cantidad y precio unitario dentro de un pedido.

| **Clase:** `DetallePedido` (DetallePedido) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Mantener la cantidad pedida y el precio histórico del producto al momento de la compra. | `Producto` |
| - Calcular el subtotal de la línea (`cantidad * precio_unitario`). | `Pedido` |

---

## 5. Clase: CuponFidelidad (LoyaltyCoupon)

**Descripción:** Representa los beneficios promocionales obtenidos por canje de puntos de fidelidad.

| **Clase:** `CuponFidelidad` (CuponFidelidad) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Generar códigos únicos de canje de cupones. | |
| - Almacenar el tipo de recompensa (ej. "Café Americano gratis"). | |
| - Validar si el cupón ya ha sido reclamado o expiró. | `Usuario`, `Pedido` |

---

## 6. Clase: HistorialPuntos (PointsHistory)

**Descripción:** Lleva el registro del flujo (ganancia y uso) de los puntos de fidelidad del cliente.

| **Clase:** `HistorialPuntos` (HistorialPuntos) | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Registrar el incremento o decremento de puntos. | `Usuario` |
| - Enlazar la transacción al pedido que la originó. | `Pedido` |
| - Proveer una glosa o descripción explicativa del movimiento (ej. *"Canje de cupón"*). | |

---

## 7. Componente: NotificadorSocket (SocketService)

**Descripción:** Componente de infraestructura para emitir notificaciones y eventos en tiempo real mediante WebSockets.

| **Componente:** `NotificadorSocket` | |
| :--- | :--- |
| **Responsabilidades** | **Colaboradores** |
| - Transmitir la llegada de un pedido a la pantalla de cocina del administrador. | `Pedido` |
| - Avisar al estudiante en tiempo real cuando su pedido cambie a estado `Listo` o `Entregado`. | `Usuario`, `Pedido` |
