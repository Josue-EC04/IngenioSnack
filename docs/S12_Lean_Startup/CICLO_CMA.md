# 🔄 CICLO CONSTRUIR-MEDIR-APRENDER (CMA)
## Lean Startup — Simulación del Ciclo de Validación
### Semana 12 — IS055B | IngenioSnack — UNCP

---

## El Ciclo CMA en IngenioSnack

```
         ┌─────────────┐
         │    IDEAS     │
         │ ¿Suscripción │
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

**Objetivo del ciclo:** Validar la hipótesis — "Los estudiantes de la FIS configurarán su combo con anticipación para evitar hacer fila" — de forma rápida, barata y con datos reales.

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

| Actividad | Tiempo |
|-----------|--------|
| Diseño visual en Canva | 2 horas |
| HTML/CSS de la página | 4 horas |
| Google Forms + Apps Script | 1 hora |
| Flyers físicos en pasillos de la FIS | 30 minutos |
| **Total** | **~1 día de trabajo** |

### Recursos invertidos

| Recurso | Cantidad | Costo |
|---------|----------|-------|
| Dinero | S/ 0 | S/ 0 |
| Personas | 2 estudiantes del equipo | S/ 0 |
| Canva | Herramienta gratuita | S/ 0 |
| GitHub Pages | Hosting gratuito | S/ 0 |
| Google Forms | Backend gratuito | S/ 0 |
| **Total** | — | **S/ 0.00** |

### Puntos de distribución del MVP
- 📌 Flyer en pasillo del **1er piso** (cerca del laboratorio) — alta efectividad
- 📌 Flyer en pasillo del **2do piso** — efectividad media
- 📌 Flyer en pasillo del **3er piso** — baja efectividad (menos tráfico)
- 📱 QR compartido por WhatsApp en grupos de estudiantes de la FIS

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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Visitas a la landing page:     82 estudiantes
  Formularios completados:       18
  Tasa de conversión:            22%
  Combo más pedido:              Café con leche + Sándwich de pollo (8 de 18)
  Días activos más comunes:      Lunes a Jueves (no viernes)

SEMANA 2 (días 8-14):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Nuevos registros:              13 → Total: 31
  Bajas/cancelaciones:           2 → Activos: 29
  Tasa de retención:             94% (solo 2 cancelaron)
  Ingresos proyectados diarios:  29 × S/ 7.00 = S/ 203 nuevos/día
  Tiempo promedio en caja:       bajó de 4 min → 1.5 min por suscriptor
```

---

## 3️⃣ APRENDER

### Análisis de los Datos

#### ¿Qué confirmaron los datos?

✅ **Hipótesis 1 VALIDADA:** Los estudiantes sí configuran su combo con anticipación.
> 22% de conversión es excelente para un servicio nuevo sin publicidad pagada. La norma en marketing digital es 2-5%.

✅ **Hipótesis 2 VALIDADA:** La demanda es predecible — solo 3 combos cubren el 100% de solicitudes.
> El Sr. Julio puede preparar ingredientes con precisión, reduciendo el desperdicio de alimentos.

✅ **Hipótesis 3 VALIDADA:** La retención del 94% en semana 2 indica que el servicio resuelve un problema real, no un capricho.
> Solo 2 de 31 estudiantes cancelaron — señal fuerte de product-market fit.

---

#### ¿Qué aprendimos que no sabíamos?

📌 **Aprendizaje 1:** Los viernes hay un 40% menos de demanda (probablemente hay menos clases presenciales). El sistema debe permitir elegir días específicos, no solo "toda la semana".

📌 **Aprendizaje 2:** Los estudiantes piden combos del mismo rango de precio (S/ 6-8). No hay interés en combos premium de S/ 12+. El mercado de la FIS es sensible al precio.

📌 **Aprendizaje 3:** La palabra **"suscripción"** generó dudas y resistencia ("suena a contrato"). Al cambiarla por **"Mi Combo Favorito"**, la tasa de conversión mejoró significativamente.

#### ¿Qué no funcionó?
⚠️ Los flyers en el 3er piso tuvieron menos impacto que los del 1er piso. Concentrar material promocional en el piso más cercano a la cafetería fue clave.

---

## 🎯 Decisión Final: ¿PERSEVERAR O PIVOTAR?

### 🟢 DECISIÓN: PERSEVERAR

**Justificación basada en métricas accionables:**

| Criterio | Meta | Resultado | ¿Supera meta? | Decisión |
|----------|------|-----------|---------------|----------|
| Registros en 2 semanas | ≥ 20 | **31** | ✅ +55% | Perseverar |
| Tasa de conversión | ≥ 15% | **22%** | ✅ +47% | Perseverar |
| Retención semana 2 | ≥ 80% | **94%** | ✅ +18% | Perseverar |
| Ingresos proyectados diarios | ≥ S/ 140 | **S/ 203** | ✅ +45% | Perseverar |

**Todas las métricas superaron el umbral mínimo de éxito.** La decisión es PERSEVERAR con el plan de desarrollo completo.

---

### Próximos Pasos — Iteración 2 (Plan de Sprints)

| Sprint | Semana | Funcionalidad | Resultado esperado |
|--------|--------|---------------|-------------------|
| **Sprint 1** | Semana 13 | Módulo de suscripción en la app existente | Los estudiantes configuran su combo desde la app |
| **Sprint 2** | Semana 14 | Notificaciones push de confirmación diaria (7:00 AM) | Aumento de tasa de confirmación |
| **Sprint 3** | Semana 15 | Panel del admin con vista de suscripciones del día | El Sr. Julio gestiona desde una pantalla |
| **Mes 2** | Semana 17+ | Presentar métricas al Decano | Solicitar S/ 3,000 para expansión a Contables |

---

### Pivot Condicional (Plan B)
Si en la Iteración 2 la retención cae por debajo del **60%** en el primer mes, pivotaremos hacia la **Idea B: Caja Sorpresa de Exámenes**, que también tuvo validación positiva en el Design Thinking y responde a una necesidad diferente pero igualmente real.

---

## 📊 Dashboard del Ciclo CMA

| Semana | Construimos | Medimos | Aprendimos |
|--------|-------------|---------|------------|
| **S1** | Landing page + flyers en 3 pisos | 18 registros, 22% conversión, 82 visitas | Lenguaje importa: "Combo" > "Suscripción" |
| **S2** | Ajustes de copy + nuevos flyers solo en 1er piso | 31 total, 94% retención, 29 activos | Los viernes hay 40% menos demanda |
| **S3 (plan)** | Módulo de suscripción en la app existente | Tasa de uso diario real de la app | ¿La notificación push aumenta la confirmación? |
| **S4 (plan)** | Notificaciones push + opción de cambio diario | Tiempo en caja, ingresos reales | ¿El precio del combo afecta la retención? |

---

## 🏁 Conclusión

El ciclo CMA demostró que **la hipótesis es válida**. Los estudiantes de la FIS-UNCP están dispuestos a configurar su combo con anticipación, y el servicio "Mi Combo Favorito" resuelve un problema real: recuperar entre 15-30 minutos de recreo que actualmente se pierden haciendo fila.

> **Próximo ciclo CMA:** Aplicar el mismo método al módulo de suscripción dentro de la app, midiendo la tasa de uso real vs. el MVP de la landing page.

---
*Semana 12 — IS055B Metodología de Desarrollo de Software*
*UNCP — Facultad de Ingeniería de Sistemas — Huancayo, Perú*
*Fecha: 09/06/2026*
