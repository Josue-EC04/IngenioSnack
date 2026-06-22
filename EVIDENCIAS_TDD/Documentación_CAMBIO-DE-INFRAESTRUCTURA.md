# Informe de Migración de Infraestructura — Gestión de Despliegue

---

## 1. Contexto del Proyecto
En el marco del desarrollo ágil de la plataforma web para la cafetería, se requiere un entorno de despliegue en la nube que garantice alta disponibilidad para las pruebas funcionales, la revisión de historias de usuario y la posterior interacción con los clientes. 

El equipo seleccionó inicialmente **Render** como el proveedor de Plataforma como Servicio (PaaS) para alojar de manera temprana el prototipo del sistema.

---

## 2. Definición de la Problemática
Durante el ciclo de integración y despliegue continuo (CI/CD), el equipo identificó una limitación crítica en el modelo operativo de la capa gratuita (*Free Tier*) de Render:

* **Restricción de Tiempo:** El servicio impone un límite estricto de **750 horas de uso gratuito al mes**, compartido entre todos los servicios web de la cuenta.
* **Impacto Operativo:** Si la aplicación web consume la totalidad de estas horas antes del fin del ciclo mensual, el servicio se suspende por completo de forma automática. Esto imposibilita el acceso de los stakeholders, detiene el flujo de retroalimentación del cliente y bloquea las pruebas de integración del equipo de desarrollo.
* **Comportamiento de Suspensión (Spin-down):** Los servicios gratuitos de Render entran en estado de "hibernación" tras 15 minutos de inactividad, lo que genera una latencia de carga inicial (Cold Start) de hasta 50 segundos cuando un usuario vuelve a ingresar, degradando la experiencia de usuario.

---

## 3. Justificación bajo la Metodología XP
Bajo los principios de Programación Extrema, mantener una infraestructura inestable contradice la práctica de **Integración Continua** y frena los ciclos cortos de entrega. 

La detección temprana de esta limitación técnica constituye un ciclo de **Retroalimentación (Feedback)** real del entorno. Continuar arrastrando esta restricción técnica añadiría una alta dosis de *deuda técnica organizativa*. Por lo tanto, el equipo ejerce el valor del **Coraje** para migrar la solución antes de que afecte los entregables finales del negocio.

---

## 4. Plan de Acción y Alternativas Evaluadas
Para garantizar que el sitio web de la cafetería permanezca en línea de manera ininterrumpida sin generar costos imprevistos en esta fase, el equipo ha decidido retirar el despliegue de Render y migrar hacia un proveedor alternativo.
