### 4.1 Selección de la Nueva Infraestructura: Railway

Tras evaluar diferentes proveedores (PaaS), el equipo técnico ha seleccionado **Railway** como la plataforma para el despliegue del aplicativo web. La decisión se fundamenta en los siguientes beneficios operativos que mitigan directamente los riesgos identificados en Render:

* **Disponibilidad Continua:** A diferencia de la limitación por horas, Railway permite una gestión de recursos más flexible, evitando caídas abruptas del servicio a fin de mes y asegurando que la plataforma esté siempre accesible para los stakeholders.
* **Reducción de Latencia (Sin Cold Start agresivo):** Railway ofrece una mejor gestión de los recursos inactivos, mitigando los tiempos de espera prolongados al reactivar la aplicación y asegurando una experiencia de usuario fluida y constante.
* **Integración y Despliegue Ágil:** La configuración automatizada desde el repositorio se alinea perfectamente con nuestras prácticas de **Integración y Despliegue Continuo (CI/CD)**, permitiendo liberar nuevas versiones de manera rápida y sin fricciones.

---

## 5. Conclusión de la Migración

El cambio de infraestructura hacia **Railway** no es solo una actualización técnica, sino una decisión estratégica que asegura la estabilidad de nuestro entorno. Al eliminar la inestabilidad del alojamiento gratuito anterior, el equipo garantiza un flujo constante de entregas, facilita las pruebas de aceptación y mantiene abierta la vía de comunicación y retroalimentación con el cliente, principios fundamentales dentro de nuestro enfoque de Programación Extrema (XP).
