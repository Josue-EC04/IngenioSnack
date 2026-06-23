# MVP DEFINIDO — "Mi Combo Favorito"
## Producto Mínimo Viable para Validación
### Semana 12 — IS055B | IngenioSnack — UNCP

---

## ¿Qué es un MVP? 

Un MVP **NO** es un producto incompleto. Es el **experimento más barato y rápido** para aprender si alguien pagaría por nuestra idea antes de invertir tiempo y dinero en desarrollarla completamente.

> **Principio Lean Startup:** "Aprende qué construir antes de construirlo."

---

##  Hipótesis Principal a Validar

> **"Creemos que los estudiantes de la FIS-UNCP que tienen un pedido recurrente estarían dispuestos a configurar su combo favorito con anticipación para no hacer fila, y que al menos el 30% de los usuarios actuales activarían esta función en las primeras 2 semanas."**

---

##  MVP Elegido: Landing Page de Suscripción + Lista de Espera

### Descripción
Una **página web simple** (sin backend complejo) que:
1. Explica el servicio "Mi Combo Favorito" en 3 pasos visuales
2. Muestra un formulario donde el estudiante elige su combo y deja su nombre + correo
3. Muestra un contador de "X estudiantes ya se apuntaron"
4. Al enviar el formulario, el Sr. Julio recibe un correo automático con el combo del estudiante

### ¿Por qué este MVP y no otro?

| Opción Evaluada | Costo | Tiempo | Aprende |
|-----------------|-------|--------|---------|
| 🏆 **Landing Page + Lista de espera** | S/ 0 | 1 día | ¿Quieren suscribirse? ✅ |
| Bot de WhatsApp manual | S/ 0 | 2 días | ¿Usan el servicio? ✅ |
| Módulo completo en la app | S/ 500+ | 3 semanas | Demasiado tarde ❌ |
| Encuesta Google Forms | S/ 0 | 2 horas | Solo opinión, no acción ⚠️ |

**El MVP ganador valida intención de acción real** (el estudiante llena el formulario y elige su combo) no solo opinión ("me gustaría").

---

### Tecnología del MVP

| Componente | Tecnología | Costo |
|------------|-----------|-------|
| **Frontend** | HTML + CSS + JavaScript puro | S/ 0 |
| **Backend (formulario)** | Google Forms → Google Sheets | S/ 0 |
| **Notificaciones al Sr. Julio** | Google Sheets + Apps Script (correo automático) | S/ 0 |
| **Hosting** | GitHub Pages | S/ 0 |
| **Dominio** | ingen-snack.github.io/combo | S/ 0 |
| **TOTAL** | — | **S/ 0.00** |

---

### Flujo Completo del MVP

```
Estudiante ve flyer físico en pasillo de la FIS
           ↓
Escanea QR → Landing Page "Mi Combo Favorito"
           ↓
Ve los 3 combos disponibles con precio
           ↓
Elige su combo + días + escribe su nombre y correo
           ↓
Hace clic en "APUNTARME AL COMBO"
           ↓
Sr. Julio recibe correo: "Ana C. quiere: Café con leche + Sándwich de pollo, L-M-X-J-V"
           ↓
Contador público: "17 estudiantes ya tienen su combo reservado"
```

---

### Contenido de la Landing Page del MVP

**Sección 1 — Hero:**
> "Tu combo favorito listo antes de que suene el timbre ☕🥪"
> [Botón naranja: QUIERO MI COMBO]

**Sección 2 — Cómo funciona:**
1. 🎯 **Elige tu combo** — Una sola vez, lo que más te gusta
2. 🍳 **Lo preparamos** — El Sr. Julio lo tiene listo antes del recreo
3. 🎒 **Solo recógelo** — Sin fila, en 30 segundos

**Sección 3 — Los combos disponibles:**
| Combo | Descripción | Precio |
|-------|-------------|--------|
| ☕🥪 Combo Clásico | Café con leche + Sándwich de pollo | S/ 7.00 |
| ☕🥙 Combo Mixto | Café con leche + Sándwich mixto | S/ 6.50 |
| 💧🥪 Combo Ligero | Agua + Sándwich de pollo | S/ 5.50 |

**Sección 4 — Formulario de registro:**
- Nombre completo
- Correo UNCP (@uncp.edu.pe)
- Combo favorito (selector)
- Días activos (checkboxes L-M-X-J-V)
- [APUNTARME AL COMBO]

**Sección 5 — Contador social:**
>  **23 estudiantes** ya tienen su combo reservado

**Sección 6 — FAQ:**
- ¿Cuándo pago? → Al recoger tu combo, en efectivo
- ¿Puedo cambiar mi combo? → Sí, cualquier día antes de las 6:30 AM
- ¿Y si me quedo sin saldo? → No hay saldo, pagas al recoger
- ¿Y si se acaba el ingrediente? → Te avisamos por WhatsApp antes

---

### Métricas del MVP (2 semanas de prueba)

| Métrica | Vanidosa ❌ | Accionable ✅ |
|---------|-----------|-------------|
| Visitas a la landing page | ✓ No dice si quieren pagar | — |
| Formularios completados | — | ✓ Intención real de uso |
| Tasa de conversión visita→registro | — | ✓ ¿El mensaje convence? |
| % que piden el mismo combo >3 días | — | ✓ ¿La rutina es real? |

**Meta mínima de éxito:** 20 estudiantes registran su combo en las primeras 2 semanas.
**Meta de expansión:** Si supera 50, solicitar los S/ 3,000 del Decano de la Facultad de Ciencias Contables.

---

## 📋 Backlog de Funcionalidades Post-MVP
*(Solo si el MVP valida la hipótesis)*

| Prioridad | Funcionalidad | Esfuerzo estimado |
|-----------|---------------|-------------------|
| 🔴 Alta | Módulo de suscripción en app existente | 2 semanas |
| 🔴 Alta | Notificación push de confirmación diaria (7:00 AM) | 1 semana |
| 🟡 Media | Opción de pausar/saltar un día | 3 días |
| 🟡 Media | Cambiar el combo del día desde la notificación | 3 días |
| 🟢 Baja | Panel del admin con suscripciones del día | 1 semana |
| 🟢 Baja | Expansión a Facultad de Ciencias Contables | 3 semanas |

---

## 📌Consideraciones Finales

> **¿Por qué NO el módulo completo en la app desde el inicio?**
> Porque si la hipótesis es incorrecta (los estudiantes no quieren esto), habremos invertido 3 semanas de desarrollo en algo que nadie usará. El MVP permite aprender en **1 día con S/ 0 de costo**.

> **Decisión Lean:** Valida primero, construye después.

---
*Semana 12 — IS055B Metodología de Desarrollo de Software*
*UNCP — Facultad de Ingeniería de Sistemas — Huancayo, Perú*
*Fecha: 23/06/2026*
