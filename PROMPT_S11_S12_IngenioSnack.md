# 🧠 PROMPT MAESTRO — SEMANAS 11 Y 12
## IngenioSnack IS055B — Design Thinking + Lean Startup
### UNCP — Facultad de Ingeniería de Sistemas — Huancayo, Perú

---

## 📌 INSTRUCCIÓN PRINCIPAL PARA EL AGENTE

Eres un desarrollador y redactor académico experto. Debes **crear todos los archivos de documentación académica** para las Semanas 11 y 12 de la asignatura "Metodología de Desarrollo de Software (IS055B)" de la UNCP. Los archivos deben ser completos, detallados, en español formal académico y listos para subir a GitHub. **No omitas ningún archivo ni sección.**

---

## 🗂️ ESTRUCTURA EXACTA DE ARCHIVOS QUE DEBES CREAR

Crea todos estos archivos dentro del proyecto actual. Si las carpetas no existen, créalas:

```
docs/
├── S11_Design_Thinking/
│   ├── MAPA_EMPATIA.png        ← Imagen generada con HTML+Canvas o SVG
│   ├── PROTOTIPO.png           ← Wireframe digital generado con HTML+SVG
│   └── DESIGN_THINKING.md     ← Documento principal S11
└── S12_Lean_Startup/
    ├── LEAN_CANVAS.md          ← Lean Canvas 9 bloques
    ├── MVP_DEFINIDO.md         ← MVP elegido y justificado
    └── CICLO_CMA.md            ← Construir-Medir-Aprender
README.md                       ← Actualizar con evolución del proyecto
```

---

## 📖 CONTEXTO DEL PROYECTO (LEE ESTO PRIMERO)

### Situación actual
Han pasado 2 meses desde que el equipo lanzó la **Iteración 1** de IngenioSnack usando XP. Los resultados fueron exitosos: las filas bajaron un 40% y los estudiantes ya recogen sus sándwiches sin esperar. El sistema de pedidos por celular funciona correctamente.

### El nuevo problema del Sr. Julio (dueño de la cafetería)
El Sr. Julio plantea dos nuevas ideas de negocio y no sabe cuál implementar:
- **Idea A:** "Suscripción Diaria" — Los estudiantes se suscriben y cada mañana tienen listo su café y sándwich favorito automáticamente.
- **Idea B:** "Caja Sorpresa de Exámenes" — Un paquete especial de snacks energéticos para épocas de parciales.

Además, el Decano de la Facultad (inversionista) ofrece **S/ 3,000 soles** si la idea es viable para expandirse a la Facultad de Ciencias Contables.

### Decisión del equipo
Después del proceso de Design Thinking, el equipo elige la **Idea A: Suscripción Diaria "Mi Combo Fijo"** como la solución a desarrollar, porque responde directamente a la necesidad más frecuente y urgente de los estudiantes.

---

## 📁 ARCHIVO 1: `docs/S11_Design_Thinking/DESIGN_THINKING.md`

Crea este archivo con el siguiente contenido completo y detallado:

```markdown
# 🎨 DESIGN THINKING — IngenioSnack
## Semana 11 — IS055B Metodología de Desarrollo de Software
**Universidad Nacional del Centro del Perú — Facultad de Ingeniería de Sistemas**
**Fecha:** 09/06/2026
**Integrantes:** [Equipo IS055B — Grupo IngenioSnack]

---

## 🎯 Reto de Diseño

> ¿Cómo podemos ayudar a los estudiantes de la FIS a alimentarse bien durante su recreo sin perder tiempo, para que puedan rendir mejor académicamente?

---

## FASE 1: EMPATIZAR 🤝

### Metodología de Investigación
Se realizaron **5 entrevistas cortas** (5 minutos cada una) a estudiantes de la FIS de la UNCP durante el recreo del día 06/06/2026, combinando preguntas directas y observación de comportamiento.

### Perfil de Entrevistados
| # | Nombre | Ciclo | Carrera | Frecuencia en cafetería |
|---|--------|-------|---------|------------------------|
| 1 | Ana C. | 5to ciclo | Ing. Sistemas | Todos los días |
| 2 | Carlos M. | 3er ciclo | Ing. Sistemas | 3 veces/semana |
| 3 | Lucía P. | 7mo ciclo | Ing. Sistemas | Solo en exámenes |
| 4 | Rodrigo T. | 4to ciclo | Ing. Sistemas | Todos los días |
| 5 | Valeria H. | 6to ciclo | Ing. Sistemas | 4 veces/semana |

### Preguntas de la Entrevista
1. ¿Qué haces durante el recreo del mediodía?
2. ¿Qué compras normalmente en la cafetería?
3. ¿Qué es lo que más te frustra de la cafetería?
4. ¿Qué harías diferente si pudieras cambiar algo?
5. ¿Pedirías siempre lo mismo si pudieras prepagarlo?

### Hallazgos Clave de las Entrevistas
- **Ana:** "Siempre pido lo mismo: café con leche y sándwich de pollo. Odio hacer fila para algo que sé que voy a pedir."
- **Carlos:** "A veces no bajo porque sé que en 10 minutos no alcanzo. Me quedo con hambre."
- **Lucía:** "En semana de exámenes me olvido de comer. Ojalá alguien me preparara algo automáticamente."
- **Rodrigo:** "Ya sé mi pedido de memoria. Sería genial que solo baje a recoger."
- **Valeria:** "Preferiría tener todo listo antes de bajar. El tiempo del recreo es poco."

---

### 🗺️ MAPA DE EMPATÍA

> *Ver archivo visual: `MAPA_EMPATIA.png`*

| Cuadrante | Hallazgos |
|-----------|-----------|
| **DICEN** 🗣️ | "Siempre pido lo mismo" / "No alcanzo a hacer fila" / "Ojalá estuviera listo" / "Me quedo con hambre" / "El recreo es muy corto" |
| **PIENSAN** 🧠 | Que el tiempo es su recurso más escaso / Que la fila es una pérdida de tiempo / Que podrían aprovechar mejor su recreo / Que a veces no vale la pena bajar |
| **HACEN** 🏃 | Piden siempre lo mismo / Se van a otras cafeterías / Se quedan sin comer / Bajan corriendo al recreo / Compran en tiendas fuera de la facultad |
| **SIENTEN** ❤️ | Frustración por esperar en fila / Ansiedad en semanas de examen / Satisfacción cuando logran comer / Resignación cuando no alcanzan / Deseo de rutinas predecibles |

**Dolores principales identificados:**
1. ⏰ **Tiempo:** El recreo de 1 hora no alcanza si hay fila larga
2. 🔄 **Rutina:** La mayoría pide siempre los mismos productos
3. 🧪 **Exámenes:** En época de parciales el problema se intensifica
4. 💸 **Dinero:** Prefieren pagar en efectivo, desconfían de pagos online

---

## FASE 2: DEFINIR 🎯

### Point of View (POV) — Declaración del Problema

> **"El estudiante de la FIS-UNCP que tiene clases seguidas necesita una forma de tener su desayuno o almuerzo listo en la cafetería IngenioSnack antes de que inicie el recreo, porque dedica demasiado tiempo haciendo fila para pedir siempre lo mismo, lo que le hace llegar tarde a clases o quedarse sin comer."**

### Desglose del POV
| Componente | Descripción |
|------------|-------------|
| **Usuario** | Estudiante de la FIS-UNCP con horario cargado |
| **Necesidad** | Obtener su comida habitual sin perder tiempo en fila |
| **Insight** | La mayoría tiene un pedido recurrente y predecible |
| **Por qué importa** | Impacta su rendimiento académico y bienestar físico |

### Preguntas "¿Cómo podríamos...?" (HMW)
- ¿Cómo podríamos hacer que el pedido del estudiante esté listo ANTES de que baje?
- ¿Cómo podríamos automatizar el pedido recurrente sin que el estudiante lo haga a diario?
- ¿Cómo podríamos ayudar al Sr. Julio a prepararse con anticipación?
- ¿Cómo podríamos premiar la fidelidad de los estudiantes que siempre piden lo mismo?

---

## FASE 3: IDEAR 💡

### Técnica: CRAZY 8s (8 ideas en 8 minutos)
*Cada integrante propuso ideas sin filtros. Luego se combinaron las mejores.*

### 10 Ideas Generadas (Lista Completa)

| # | Idea | Descripción breve |
|---|------|-------------------|
| 1 | 🔔 **Suscripción "Mi Combo Fijo"** | El estudiante elige un combo fijo semanal y el sistema lo prepara automáticamente cada día |
| 2 | 📦 **Caja Sorpresa de Exámenes** | Pack semanal de snacks energéticos que se activa en semanas de parciales |
| 3 | ⏱️ **Pedido con 30 min de anticipación** | Sistema de alerta que notifica al Sr. Julio con media hora de antelación |
| 4 | 🎮 **Gamificación extrema** | Los estudiantes ganan XP y desbloquean descuentos por rachas de pedidos diarios |
| 5 | 🤝 **Pedido grupal por aula** | Un delegado por salón recoge el pedido de todos y lo envía junto |
| 6 | 🚚 **Delivery al salón** | El Sr. Julio lleva los pedidos directamente al aula durante el recreo |
| 7 | 🤖 **Bot de WhatsApp** | El estudiante confirma su pedido del día enviando "1" al WhatsApp del Sr. Julio |
| 8 | 💳 **Monedero prepago IngenioSnack** | Los estudiantes cargan saldo al inicio de la semana y descontamos por pedido |
| 9 | 📅 **Menú semanal anticipado** | El Sr. Julio publica el menú el lunes y los estudiantes reservan para toda la semana |
| 10 | 🌟 **Plan VIP para tesistas** | Los estudiantes en tesis tienen una línea express con beneficios especiales |

### Votación del Equipo — Top 2 Seleccionadas

**🏆 GANADORA: Idea #1 — Suscripción "Mi Combo Fijo"**
- Votos: 4/5 integrantes
- Razón: Es automatizable, genera ingresos recurrentes predecibles, resuelve el problema de la rutina, y es escalable a otras facultades.

**🥈 SEGUNDA: Idea #7 — Bot de WhatsApp**
- Votos: 3/5 integrantes
- Razón: Bajo costo de implementación, los estudiantes ya usan WhatsApp, el Sr. Julio puede empezar sin sistema.

---

## FASE 4: PROTOTIPAR 🖼️

### Solución Elegida: **"Mi Combo Fijo" — Sistema de Suscripción Diaria**

#### Descripción del Prototipo
Se diseñó un **wireframe digital de baja fidelidad** (ver `PROTOTIPO.png`) que muestra las pantallas principales del flujo de suscripción para el estudiante.

#### Pantallas del Prototipo

**Pantalla 1 — Configurar Mi Suscripción**
```
┌─────────────────────────┐
│  ☕ Mi Combo Fijo        │
│─────────────────────────│
│  Bebida favorita:        │
│  ○ Café americano        │
│  ● Café con leche        │
│  ○ Agua                  │
│                          │
│  Sándwich favorito:      │
│  ● Pollo                 │
│  ○ Mixto                 │
│  ○ Jamón y queso         │
│                          │
│  Días activos:           │
│  [L] [M] [X] [J] [V]   │
│                          │
│  Total diario: S/ 7.00  │
│  [ACTIVAR SUSCRIPCIÓN]  │
└─────────────────────────┘
```

**Pantalla 2 — Confirmación Diaria (7:00 AM)**
```
┌─────────────────────────┐
│  🔔 IngenioSnack         │
│─────────────────────────│
│  ¡Buenos días, Ana! 👋  │
│                          │
│  Tu combo de hoy:        │
│  ☕ Café con leche        │
│  🥪 Sándwich de pollo    │
│  Total: S/ 7.00          │
│                          │
│  [✓ CONFIRMAR]           │
│  [✗ SALTAR HOY]          │
│  [✏ CAMBIAR HOY]         │
└─────────────────────────┘
```

**Pantalla 3 — Admin: Vista de Suscripciones del Día**
```
┌─────────────────────────┐
│  📋 Pedidos de Hoy       │
│  Suscripciones: 12       │
│─────────────────────────│
│  Ana C.  → Café+Pollo   │
│  Rodrigo → Café+Mixto   │
│  Valeria → Agua+Pollo   │
│  ...                     │
│  [MARCAR LISTOS]         │
└─────────────────────────┘
```

#### Herramienta Usada
Wireframe creado con **PowerPoint / dibujo en papel** y digitalizado como imagen PNG (ver `PROTOTIPO.png`).

---

## FASE 5: TESTEAR ✅

### Metodología de Testing
Se presentó el prototipo en papel a **2 estudiantes reales** de la FIS durante el recreo del 06/06/2026.

### Resultados del Testing

| Criterio | Estudiante 1: Ana C. (5to ciclo) | Estudiante 2: Rodrigo T. (4to ciclo) |
|----------|----------------------------------|--------------------------------------|
| **Qué le GUSTÓ** | "Poder elegir mis días activos. No siempre vengo los viernes." / "La confirmación a las 7am está genial, me recuerda." | "Que pueda cambiar el pedido del día si quiero algo diferente." / "El total diario visible es útil para mi presupuesto." |
| **Qué NO le gustó** | "¿Y si me quedo sin saldo? ¿Qué pasa?" / "No veo cómo cancelar la suscripción si quiero." | "El botón 'ACTIVAR SUSCRIPCIÓN' suena a contrato. Prefiero 'Guardar mi combo'." / "¿Puedo cambiar mi combo cada semana?" |
| **Dudas que tuvo** | ¿El pago es adelantado o al recoger? / ¿Qué pasa si el producto se acaba? | ¿Puedo tener 2 combos diferentes? / ¿Me avisan si cambia el precio? |

### Insights del Testing
1. **Lenguaje:** Evitar palabras como "suscripción" o "contrato". Usar "Mi Combo Favorito".
2. **Pago:** Mantener pago contra entrega para no generar desconfianza.
3. **Flexibilidad:** Debe ser fácil pausar, cambiar o cancelar el combo.
4. **Stock:** El sistema debe avisarles si su producto del día está agotado.

### Decisión Post-Testing
✅ **Perseverar con la idea** — La respuesta fue muy positiva. Se ajustará el lenguaje y se añadirá la opción de "pausar combo" antes de implementar.

---

## 📊 Resumen Ejecutivo del Design Thinking

| Fase | Herramienta | Resultado |
|------|-------------|-----------|
| Empatizar | 5 entrevistas + observación | Mapa de Empatía completo |
| Definir | POV + HMW | Problema central identificado |
| Idear | Crazy 8s + votación | 10 ideas → 2 finalistas |
| Prototipar | Wireframe digital | 3 pantallas principales |
| Testear | 2 usuarios reales | Feedback accionable recogido |

**Idea seleccionada:** Sistema de Suscripción Diaria "Mi Combo Favorito"
**Siguiente paso:** Lean Startup — Validar si el estudiante PAGARÍA por esto.
```

---

## 📁 ARCHIVO 2: `docs/S12_Lean_Startup/LEAN_CANVAS.md`

Crea este archivo con el siguiente contenido:

```markdown
# 📊 LEAN CANVAS — IngenioSnack
## Nuevo Servicio: "Mi Combo Favorito" — Suscripción Diaria
### Semana 12 — IS055B | UNCP — Facultad de Ingeniería de Sistemas

---

## 🗺️ El Lienzo Lean Startup (9 Bloques)

| Bloque | Contenido |
|--------|-----------|
| **1. PROBLEMA** | Los estudiantes de la FIS-UNCP pierden entre 15-30 min de su recreo haciendo fila para comprar siempre los mismos productos. En semanas de examen esto empeora y muchos terminan sin comer. |
| **2. SEGMENTO DE CLIENTES** | **Primario:** Estudiantes de la FIS-UNCP que asisten al menos 3 días/semana a la cafetería y tienen un pedido recurrente fijo. (~60-80 estudiantes diarios). **Secundario (futuro):** Estudiantes de la Facultad de Ciencias Contables. |
| **3. PROPUESTA DE VALOR ÚNICA** | "Tu desayuno favorito listo antes de que suene el timbre. Sin fila, sin esperar, sin pensar." — Un combo personalizado que se prepara automáticamente cada día que tú eliges. |
| **4. SOLUCIÓN** | Sistema web/móvil que permite al estudiante configurar su "Combo Favorito" una sola vez. Cada mañana recibe una notificación de confirmación. Al bajar al recreo, su pedido ya está listo. Pago contra entrega al recoger. |
| **5. CANALES** | App web (ya existe desde Iteración 1) / Notificaciones push en el celular / WhatsApp como canal alternativo / Flyers físicos en los pasillos de la FIS |
| **6. FUENTES DE INGRESOS** | Venta directa de combos diarios (precio combo = precio normal, sin recargo) / Posible descuento de fidelidad: combo de 5 días = 1 café gratis / Expansión a Contables: +S/ 3,000 de inversión del Decano |
| **7. ESTRUCTURA DE COSTOS** | Desarrollo de módulo de suscripción en el sistema existente (ya desarrollado) / Notificaciones push (servicio gratuito con Firebase) / Costo de insumos adicionales por predicción de demanda / Sin costo fijo adicional para el Sr. Julio |
| **8. MÉTRICAS CLAVE** | Nº de suscripciones activas por semana / Tasa de confirmación diaria (cuántos confirman vs. saltan) / Tasa de retención a la semana 4 / Ingresos recurrentes semanales / Tiempo promedio de atención en caja (debe reducirse) |
| **9. VENTAJA INJUSTA** | El sistema ya existe (Iteración 1) — agregar suscripción es incremental, no una construcción desde cero. La relación de confianza del Sr. Julio con los estudiantes de la FIS es insustituible. Los datos históricos de pedidos de la Iteración 1 ya permiten predecir qué combinará mejor. |

---

## 🔍 Análisis Profundo de Bloques Clave

### Problema (Detallado)
**Top 3 problemas por orden de urgencia:**
1. ⏰ Tiempo perdido en fila (15-30 min de 60 disponibles = 25-50% del recreo)
2. 🔄 Fricción de decidir/pedir lo mismo todos los días (fatiga de decisión)
3. 🧪 En exámenes: el estrés hace que los estudiantes se olviden de comer

**Soluciones alternativas actuales (competencia indirecta):**
- Otras cafeterías dentro de la universidad
- Tiendas fuera del campus
- Traer comida de casa
- No comer (opción más común en exámenes)

### Propuesta de Valor Única (UVP)
> **"El único lugar donde tu almuerzo ya está listo cuando bajas. Sin fila. Sin esperar. Sin pensar."**

Diferenciadores:
- Personalización: el combo es exactamente lo que el estudiante quiere
- Anticipación: listo ANTES de que baje, no mientras espera
- Confianza: paga al recoger, no adelantado
- Simplicidad: configura una vez, funciona todos los días

### Ventaja Injusta (Defensible Moat)
1. **Base instalada:** Ya tienen la app de la Iteración 1 funcionando
2. **Datos de comportamiento:** Saben qué piden los estudiantes y cuándo
3. **Confianza del Sr. Julio:** Construida en 2 meses de operación
4. **Localización:** Justo al lado de los laboratorios de la FIS
5. **Conocimiento del contexto:** Saben cuándo son los exámenes de la UNCP
```

---

## 📁 ARCHIVO 3: `docs/S12_Lean_Startup/MVP_DEFINIDO.md`

Crea este archivo con el siguiente contenido:

```markdown
# 🚀 MVP DEFINIDO — "Mi Combo Favorito"
## Producto Mínimo Viable para Validación
### Semana 12 — IS055B | IngenioSnack — UNCP

---

## ¿Qué es un MVP? (Contexto)
Un MVP **NO** es un producto incompleto. Es el **experimento más barato y rápido** para aprender si alguien pagaría por nuestra idea antes de invertir tiempo y dinero en desarrollarla completamente.

---

## 💡 Hipótesis Principal a Validar
> **"Creemos que los estudiantes de la FIS-UNCP que tienen un pedido recurrente estarían dispuestos a configurar su combo favorito con anticipación para no hacer fila, y que al menos el 30% de los usuarios actuales activarían esta función en las primeras 2 semanas."**

---

## 🏆 MVP Elegido: Landing Page de Suscripción + Lista de Espera

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

### Tecnología del MVP
- **Frontend:** HTML + CSS + JavaScript puro (o Canva con enlace a Google Forms)
- **Backend:** Google Forms como backend gratuito → respuestas a Google Sheets
- **Notificaciones:** Google Sheets → correo automático al Sr. Julio (via Apps Script)
- **Hosting:** GitHub Pages (gratis)
- **Dominio:** ingen-snack.github.io/combo (o similar)
- **Costo total:** S/ 0.00

### Flujo del MVP

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

### Métricas del MVP (2 semanas de prueba)

| Métrica | Vanidosa ❌ | Accionable ✅ |
|---------|-----------|-------------|
| Visitas a la landing page | ✓ No dice si quieren pagar | — |
| Formularios completados | — | ✓ Intención real de uso |
| Tasa de conversión visita→registro | — | ✓ ¿El mensaje convence? |
| % que piden el mismo combo >3 días | — | ✓ ¿La rutina es real? |

**Meta mínima de éxito:** 20 estudiantes registran su combo en las primeras 2 semanas.
**Meta de expansión:** Si supera 50, solicitar los S/ 3,000 del Decano.

---

## 📋 Backlog de Funcionalidades Post-MVP
*(Solo si el MVP valida la hipótesis)*

| Prioridad | Funcionalidad | Esfuerzo |
|-----------|---------------|----------|
| 🔴 Alta | Módulo de suscripción en app existente | 2 semanas |
| 🔴 Alta | Notificación push de confirmación diaria | 1 semana |
| 🟡 Media | Opción de pausar/saltar un día | 3 días |
| 🟡 Media | Cambiar el combo del día desde la notificación | 3 días |
| 🟢 Baja | Panel del admin con suscripciones del día | 1 semana |
| 🟢 Baja | Expansión a Facultad de Ciencias Contables | 3 semanas |
```

---

## 📁 ARCHIVO 4: `docs/S12_Lean_Startup/CICLO_CMA.md`

Crea este archivo con el siguiente contenido:

```markdown
# 🔄 CICLO CONSTRUIR-MEDIR-APRENDER (CMA)
## Lean Startup — Simulación del Ciclo de Validación
### Semana 12 — IS055B | IngenioSnack — UNCP

---

## El Ciclo CMA en IngenioSnack

```
         ┌─────────────┐
         │   IDEAS      │
         │  ¿Suscripción│
         │  diaria?     │
         └──────┬───────┘
                │
         ┌──────▼───────┐
    ┌───►│  CONSTRUIR   │
    │    │  Landing page│
    │    │  + formulario│
    │    └──────┬───────┘
    │           │
    │    ┌──────▼───────┐
    │    │    MEDIR     │
    │    │  Registros,  │
    │    │  conversión  │
    │    └──────┬───────┘
    │           │
    │    ┌──────▼───────┐
    └────│   APRENDER   │
         │ ¿Perseverar  │
         │  o Pivotar?  │
         └──────────────┘
```

---

## 1️⃣ CONSTRUIR

### Qué construimos
**Una landing page de suscripción** desplegada en GitHub Pages con las siguientes secciones:

1. **Hero:** "Tu combo favorito listo antes de bajar" con foto de la cafetería
2. **Cómo funciona:** 3 pasos visuales (Elige tu combo / Lo preparamos / Solo recógelo)
3. **Los combos disponibles:** Tarjetas con foto, precio y descripción de cada opción
4. **Formulario de registro:** Nombre, correo, combo favorito, días de la semana
5. **Contador social:** "🔥 23 estudiantes ya tienen su combo reservado"
6. **FAQ:** Preguntas frecuentes (¿Cuándo pago? ¿Puedo cambiar? ¿Y si se acaba?)

### Tiempo de construcción
- Diseño en Canva: 2 horas
- HTML/CSS de la página: 4 horas
- Google Forms + Apps Script: 1 hora
- Flyers físicos en pasillos: 30 minutos
- **Total: ~1 día de trabajo**

### Recursos invertidos
- Dinero: S/ 0
- Personas: 2 estudiantes del equipo
- Herramientas: Canva (gratis), GitHub Pages (gratis), Google Forms (gratis)

---

## 2️⃣ MEDIR

### Métricas Definidas (Semana 1 y Semana 2)

#### Métricas Vanidosas vs. Accionables

| Métrica Vanidosa ❌ | Por qué no sirve |
|--------------------|-----------------|
| Visitas totales a la landing | Alta ≠ quieren el servicio |
| Likes en redes sociales | No predicen compra |
| "Me parece buena idea" en encuesta | Opinión ≠ acción |

| Métrica Accionable ✅ | Objetivo | Resultado Simulado |
|----------------------|----------|-------------------|
| Formularios completados (Week 1) | ≥ 10 | **18 registros** |
| Formularios completados (Week 2) | ≥ 20 total | **31 registros** |
| Tasa de conversión (visitas→registro) | ≥ 15% | **22%** |
| Combos únicos solicitados | Identificar TOP 3 | Café+Pollo (45%), Café+Mixto (29%), Agua+Pollo (26%) |
| Días más solicitados | Identificar patrón | L-M-X-J > viernes |
| Cancelaciones en semana 2 | < 20% | **6%** |

#### Datos Simulados de la Medición (proporcionados por el docente)

```
SEMANA 1 (días 1-7):
- Visitas a la landing: 82 estudiantes
- Formularios completados: 18
- Tasa de conversión: 22%
- Combo más pedido: Café con leche + Sándwich de pollo (8 de 18)
- Días activos más comunes: Lunes a Jueves (no viernes)

SEMANA 2 (días 8-14):
- 13 nuevos registros = 31 total
- 2 bajas = 29 activos
- Tasa de retención: 94% (solo 2 cancelaron)
- Ingresos proyectados diarios: 29 × S/7.00 = S/203 nuevos/día
- Tiempo promedio en caja: bajó de 4 min a 1.5 min por suscriptor
```

---

## 3️⃣ APRENDER

### Análisis de los Datos

#### ¿Qué confirmaron los datos?
✅ **Hipótesis 1 VALIDADA:** Los estudiantes sí configuran su combo con anticipación (22% de conversión es excelente para un servicio nuevo sin publicidad pagada).

✅ **Hipótesis 2 VALIDADA:** La demanda es predecible — solo 3 combos cubren el 100% de solicitudes. El Sr. Julio puede preparar ingredientes con precisión.

✅ **Hipótesis 3 VALIDADA:** La retención del 94% en semana 2 indica que el servicio resuelve un problema real, no un capricho.

#### ¿Qué aprendimos que no sabíamos?
📌 **Aprendizaje 1:** Los viernes hay un 40% menos de demanda (probablemente hay menos clases). El sistema debe permitir elegir días específicos.

📌 **Aprendizaje 2:** Los estudiantes piden combos del mismo rango de precio (S/6-8). No hay interés en combos premium de S/12+.

📌 **Aprendizaje 3:** La palabra "suscripción" generó dudas. Al cambiarla por "Mi Combo Favorito", la tasa de conversión mejoró.

#### ¿Qué no funcionó?
⚠️ Los flyers en el 3er piso tuvieron menos impacto. Los del 1er piso (cerca del laboratorio) fueron los más efectivos.

---

## 🎯 Decisión Final: ¿PERSEVERAR O PIVOTAR?

### 🟢 DECISIÓN: PERSEVERAR

**Justificación basada en métricas accionables:**

| Criterio | Meta | Resultado | Decisión |
|----------|------|-----------|----------|
| Registros en 2 semanas | ≥ 20 | 31 ✅ | Perseverar |
| Tasa de conversión | ≥ 15% | 22% ✅ | Perseverar |
| Retención semana 2 | ≥ 80% | 94% ✅ | Perseverar |
| Ingresos proyectados diarios | ≥ S/140 | S/203 ✅ | Perseverar |

### Próximos Pasos (Iteración 2)
1. **Sprint 1 (1 semana):** Desarrollar módulo de suscripción en la app existente
2. **Sprint 2 (1 semana):** Sistema de notificaciones push de confirmación diaria
3. **Sprint 3 (1 semana):** Panel del admin con vista de suscripciones del día
4. **Mes 2:** Presentar métricas al Decano y solicitar S/3,000 para expansión a Contables

### Pivot Condicional
Si en la Iteración 2 la retención cae por debajo del 60% en el primer mes, pivotaremos hacia la **Idea B: Caja Sorpresa de Exámenes**, que también tuvo validación positiva en el Design Thinking.

---

## 📊 Dashboard del Ciclo CMA

| Semana | Construimos | Medimos | Aprendimos |
|--------|-------------|---------|------------|
| S1 | Landing page + flyers | 18 registros, 22% conversión | Lenguaje importa: "Combo" > "Suscripción" |
| S2 | Ajustes de copy + nuevos flyers S1 | 31 total, 94% retención | Los viernes hay 40% menos demanda |
| S3 (plan) | Módulo en app | Tasa de uso diario real | ¿La notificación aumenta la confirmación? |
```

---

## 📁 ARCHIVO 5: `README.md` (ACTUALIZAR)

Actualiza el README.md del proyecto con esta nueva sección al final:

```markdown
## 📚 Evolución del Proyecto IngenioSnack

### Iteración 1 — Semanas 1-10 (XP — Extreme Programming)
✅ Sistema de pedidos web/móvil implementado
✅ Menú digital con gestión de stock en tiempo real
✅ Sistema de fidelización "Café de la Lealtad" (10 sándwiches = 1 café gratis)
✅ Panel de administración con reportes de ventas
✅ Resultado: Filas reducidas en un 40%

---

### Semana 11 — Design Thinking: "Pensando como el Estudiante de la FIS"
📍 Metodología: Design Thinking (5 fases)
📍 Problema nuevo: ¿Suscripción diaria o Caja Sorpresa de Exámenes?
📍 Resultado: Validación de "Mi Combo Favorito" como solución principal

**Entregables:**
- `docs/S11_Design_Thinking/MAPA_EMPATIA.png`
- `docs/S11_Design_Thinking/PROTOTIPO.png`
- `docs/S11_Design_Thinking/DESIGN_THINKING.md`

---

### Semana 12 — Lean Startup: "Construir, Medir y Aprender"
📍 Metodología: Lean Startup + MVP + Ciclo CMA
📍 MVP: Landing page de suscripción (S/0 de costo, 1 día de construcción)
📍 Resultado: 31 suscriptores en 2 semanas → PERSEVERAR

**Entregables:**
- `docs/S12_Lean_Startup/LEAN_CANVAS.md`
- `docs/S12_Lean_Startup/MVP_DEFINIDO.md`
- `docs/S12_Lean_Startup/CICLO_CMA.md`

---

### Próximos Pasos — Iteración 2
- [ ] Módulo de suscripción en la app existente
- [ ] Notificaciones push diarias de confirmación
- [ ] Panel admin con vista de suscripciones
- [ ] Expansión a Facultad de Ciencias Contables (pendiente inversión S/3,000)
```

---

## 🖼️ ARCHIVOS DE IMAGEN: `MAPA_EMPATIA.png` y `PROTOTIPO.png`

Para generar las imágenes PNG, crea un script HTML que las genere usando Canvas o SVG, luego captúralas como PNG. Sigue estos pasos:

### Para MAPA_EMPATIA.png:
Crea un archivo `generar_empatia.html` que dibuje con SVG/Canvas el mapa de empatía con 4 cuadrantes (DICEN / PIENSAN / HACEN / SIENTEN) con el contenido de la Fase 1. Luego usa una herramienta como `puppeteer` o `html2canvas` para exportarlo como PNG y guardarlo en `docs/S11_Design_Thinking/MAPA_EMPATIA.png`.

**Contenido del mapa:**
- **DICEN (azul):** "Siempre pido lo mismo" / "No alcanzo a hacer fila" / "Ojalá estuviera listo" / "El recreo es muy corto"
- **PIENSAN (morado):** El tiempo es escaso / La fila es una pérdida / Podrían aprovechar mejor el recreo
- **HACEN (verde):** Piden siempre lo mismo / Van a otras cafeterías / Se quedan sin comer en exámenes
- **SIENTEN (naranja):** Frustración / Ansiedad en exámenes / Deseo de rutinas predecibles
- **Centro (usuario):** "Estudiante FIS-UNCP con horario cargado"

### Para PROTOTIPO.png:
Crea un archivo `generar_prototipo.html` que dibuje con SVG/HTML las 3 pantallas wireframe del flujo de suscripción (Configurar combo / Confirmación matutina / Vista admin) lado a lado. Expórtalo como PNG en `docs/S11_Design_Thinking/PROTOTIPO.png`.

**Si no puedes generar PNG programáticamente**, crea los archivos HTML en `docs/S11_Design_Thinking/` y documenta en el DESIGN_THINKING.md que las imágenes están representadas en el HTML. El docente lo aceptará como evidencia equivalente.

---

## ✅ CHECKLIST FINAL DE VERIFICACIÓN

Antes de terminar, verifica que existan TODOS estos archivos:

- [ ] `docs/S11_Design_Thinking/DESIGN_THINKING.md` — con las 5 fases completas
- [ ] `docs/S11_Design_Thinking/MAPA_EMPATIA.png` (o .html como alternativa)
- [ ] `docs/S11_Design_Thinking/PROTOTIPO.png` (o .html como alternativa)
- [ ] `docs/S12_Lean_Startup/LEAN_CANVAS.md` — con los 9 bloques
- [ ] `docs/S12_Lean_Startup/MVP_DEFINIDO.md` — con MVP justificado
- [ ] `docs/S12_Lean_Startup/CICLO_CMA.md` — con los 3 pasos y decisión
- [ ] `README.md` — actualizado con evolución del proyecto

**Criterios de calidad:**
- Todo en español formal académico
- Tablas y listas bien formateadas en Markdown
- Sin secciones vacías ni placeholders
- Contenido específico del contexto UNCP Huancayo

---

## 🚨 NOTAS IMPORTANTES PARA EL AGENTE

1. **Crea los archivos con el contenido completo tal como se especifica**, no solo la estructura vacía.
2. **Usa Markdown correcto** — tablas con `|`, encabezados con `#`, listas con `-` o `*`.
3. **Contexto:** UNCP, Huancayo, Perú. Precios en Soles (S/). Facultad de Ingeniería de Sistemas.
4. **Asignatura:** IS055B — Metodología de Desarrollo de Software.
5. **Los archivos deben poder subirse a GitHub directamente** y ser evaluados por el docente.
6. Si ya existe un README.md, **agrégale las secciones nuevas al final** sin borrar lo existente.
7. **Genera las imágenes PNG** usando puppeteer, canvas, o la herramienta que tengas disponible. Si no es posible generar PNG, crea los archivos HTML equivalentes.

---
*Práctica Semanas 11 y 12 — IS055B — UNCP — Fecha: 09.06.2026*
*Caso de Estudio N° 04: "IngenioSnack" — Innovación y Validación Ágil*
