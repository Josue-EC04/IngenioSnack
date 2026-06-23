### 4.1 Selección de la Nueva Infraestructura: Railway

Tras evaluar diferentes proveedores (PaaS), el equipo técnico ha seleccionado **Railway** como la plataforma para el despliegue del aplicativo web. La decisión se fundamenta en los siguientes beneficios operativos y técnicos que mitigan directamente los riesgos identificados en la capa gratuita de Render:

* **Disponibilidad Continua y Recursos Flexibles:** A diferencia de la estricta limitación de 750 horas, Railway provee un entorno de ejecución continuo (24/7) más estable. Esto evita las interrupciones críticas a fin de mes, asegurando que la plataforma esté siempre accesible tanto para el equipo de QA como para los stakeholders y el cliente final.
* **Eliminación del Cold Start Agresivo:** Railway mantiene el entorno en un estado de mayor disponibilidad. Al mitigar la necesidad de reanudar el contenedor tras periodos de inactividad de 15 minutos, se eliminan los tiempos de carga prolongados (de hasta 50 segundos en Render). Esto garantiza una experiencia de usuario ágil y fluida desde el primer clic.
* **Integración y Despliegue Ágil (CI/CD nativo):** La plataforma se enlaza de forma nativa con GitHub. Cualquier nuevo *commit* o *merge* hacia la rama principal desencadena automáticamente la construcción y el despliegue de la aplicación, alineándose perfectamente con el principio de **Integración Continua** de XP.
* **Gestión Centralizada de Entornos y Variables:** Railway facilita la configuración de variables de entorno de forma segura e intuitiva. Esto nos permite separar claramente las configuraciones de desarrollo y pruebas, minimizando el riesgo de errores humanos.
* **Monitorización y Logs en Tiempo Real:** La plataforma incluye herramientas integradas para visualizar los registros (logs) del sistema en vivo y métricas de consumo de red, memoria y CPU, facilitando el diagnóstico rápido ante posibles errores de despliegue.

---

### 4.2 Proceso de Migración Ejecutado

La transición hacia la nueva infraestructura se realizó minimizando los tiempos de inactividad (*downtime*) mediante los siguientes pasos técnicos:

1. **Vinculación del Repositorio:** Se autorizó la aplicación de Railway en nuestra cuenta de GitHub y se conectó el repositorio principal del proyecto (`IngenioSnack`).
2. **Configuración del Entorno:** Se migraron las variables de entorno (*Environment Variables*) que el proyecto necesita para operar.
3. **Despliegue de Prueba (Staging):** Se lanzó una primera compilación para verificar que las dependencias, los scripts de construcción (*build scripts*) y el inicio de la aplicación funcionaran correctamente en la arquitectura de Railway.
4. **Verificación de Calidad (Sanity Check):** El equipo verificó la navegación, el rendimiento inicial de la plataforma y el correcto enrutamiento, confirmando la resolución del problema de "Cold Start".
5. **Corte y Transición Final:** Una vez comprobada la estabilidad en el nuevo proveedor, se dio de baja el servicio anterior en Render para centralizar las operaciones en Railway.

---

## 5. Conclusión y Proyección de la Migración

El cambio de infraestructura hacia **Railway** no es solo un parche técnico, sino una decisión estratégica que asienta una base sólida para el proyecto. Al eliminar la inestabilidad del alojamiento gratuito anterior, el equipo garantiza un flujo constante de entregas y facilita de manera directa las pruebas de aceptación.

Bajo la filosofía de **Programación Extrema (XP)**, mantener una comunicación y retroalimentación frecuente con el cliente es innegociable; esta nueva arquitectura nos permite tener la aplicación siempre dispuesta para esas revisiones. A futuro, la modularidad de Railway también nos permitirá escalar los servicios de manera sencilla (por ejemplo, añadiendo bases de datos o servicios backend aislados con unos pocos clics) a medida que el proyecto crezca y el alcance del producto requiera de mayor robustez.
