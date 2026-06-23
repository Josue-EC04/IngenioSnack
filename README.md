# IngenioSnack — Sistema Web de Cafetería Digital

Este proyecto es una plataforma web desarrollada para la cafetería **IngenioSnack** de la Universidad Nacional del Centro del Perú (UNCP).
Fue construido utilizando metodologías ágiles (Extreme Programming - XP) y TDD (Test-Driven Development) como parte del curso de Ingeniería de Software.

## 🛠 Tecnologías Utilizadas

### Frontend (`/src/frontend`)
- **React 19** + **Vite**
- **Tailwind CSS** para estilos
- **React Router DOM** para enrutamiento
- **Axios** para peticiones HTTP
- **Socket.io-client** para comunicación en tiempo real
- **Chart.js** y **react-chartjs-2** para gráficos

### Backend (`/src/backend`)
- **Node.js** + **Express.js**
- **Prisma ORM** para el modelado de base de datos
- **PostgreSQL** (alojado en Supabase)
- **Socket.io** para eventos en tiempo real (ej. notificaciones de pedidos)
- **JWT (JSON Web Tokens)** y **Bcrypt.js** para autenticación y seguridad
- **Multer** para carga de imágenes y archivos

## 📂 Estructura del Repositorio

El proyecto sigue una estructura orientada al desarrollo ágil y TDD:

- `/src/frontend`: Código fuente de la aplicación cliente (React).
- `/src/backend`: Código fuente de la API y servidor (Node.js).
- `/tests`: Pruebas unitarias bajo el enfoque TDD.
- `/docs`: Documentación técnica del sistema. Incluye las **Historias de Usuario** (`HISTORIAS_USUARIO.md`) y el diseño basado en **Tarjetas CRC** (`TARJETAS_CRC.md`).
- `/EVIDENCIAS_TDD`: Capturas del flujo Red-Green-Refactor.
- `BITACORA_PAIR_PROGRAMMING.md`: Registro de las sesiones de trabajo en pareja (ubicado en `/docs`).
- `REFACTORIZACION.md`: Registro de los code smells solucionados y mejoras de clean code (ubicado en `/docs`).

## 🚀 Configuración y Ejecución Local

Para levantar el entorno de desarrollo local, asegúrate de tener instalado **Node.js** y seguir estos pasos:

### 1. Variables de Entorno (.env)

Asegúrate de contar con los archivos `.env` en ambas carpetas.

**En `/src/backend/.env`:**
```env
DATABASE_URL="postgresql://usuario:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://usuario:password@host:5432/postgres"
JWT_SECRET="tu_secreto_generado"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**En `/src/frontend/.env`:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### 2. Instalación y Ejecución

Debes abrir dos terminales en la raíz del proyecto.

**Terminal 1: Backend**
```bash
cd src/backend
# Instalar dependencias (esto también ejecuta prisma generate)
npm install
# Aplicar migraciones a la base de datos de Supabase
npx prisma migrate deploy
# Opcional: Popular la base de datos
npm run db:seed
# Iniciar servidor de desarrollo
npm run dev
```

**Terminal 2: Frontend**
```bash
cd src/frontend
# Instalar dependencias
npm install
# Iniciar servidor de desarrollo
npm run dev
```
La aplicación estará disponible en [http://localhost:5173](http://localhost:5173) y la API en [http://localhost:3001](http://localhost:3001).

## 🌍 Despliegue (Deploy)

El proyecto está configurado para desplegarse automáticamente en **Render** mediante el archivo `render.yaml` en la raíz del repositorio, configurando servicios independientes para el backend web service y el frontend static site.

---

## 📚 Evolución del Proyecto IngenioSnack

### Iteración 1 — Semanas 1-10 (XP — Extreme Programming)
✅ Sistema de pedidos web/móvil implementado
✅ Menú digital con gestión de stock en tiempo real
✅ Sistema de fidelización "Café de la Lealtad" (10 sándwiches = 1 café gratis)
✅ Panel de administración con reportes de ventas
✅ **Resultado:** Filas reducidas en un 40%

---

### Semana 11 — Design Thinking: "Pensando como el Estudiante de la FIS"
📍 **Metodología:** Design Thinking (5 fases: Empatizar → Definir → Idear → Prototipar → Testear)
📍 **Problema nuevo:** ¿Suscripción diaria ("Mi Combo Fijo") o Caja Sorpresa de Exámenes?
📍 **Resultado:** Validación de "Mi Combo Favorito" como solución principal tras entrevistar a 5 estudiantes y testear el prototipo con 2 usuarios reales.

**Entregables:**
- [`docs/S11_Design_Thinking/MAPA_EMPATIA.png`](docs/S11_Design_Thinking/MAPA_EMPATIA.png)
- [`docs/S11_Design_Thinking/PROTOTIPO.png`](docs/S11_Design_Thinking/PROTOTIPO.png)
- [`docs/S11_Design_Thinking/DESIGN_THINKING.md`](docs/S11_Design_Thinking/DESIGN_THINKING.md)

---

### Semana 12 — Lean Startup: "Construir, Medir y Aprender"
📍 **Metodología:** Lean Startup + MVP + Ciclo CMA (Construir-Medir-Aprender)
📍 **MVP elegido:** Landing page de suscripción en GitHub Pages (S/ 0 de costo, 1 día de construcción)
📍 **Resultado:** 31 suscriptores en 2 semanas, 22% de conversión, 94% de retención → **DECISIÓN: PERSEVERAR**

**Entregables:**
- [`docs/S12_Lean_Startup/LEAN_CANVAS.md`](docs/S12_Lean_Startup/LEAN_CANVAS.md)
- [`docs/S12_Lean_Startup/MVP_DEFINIDO.md`](docs/S12_Lean_Startup/MVP_DEFINIDO.md)
- [`docs/S12_Lean_Startup/CICLO_CMA.md`](docs/S12_Lean_Startup/CICLO_CMA.md)

---

### Próximos Pasos — Iteración 2
- [ ] Módulo de suscripción integrado en la app existente
- [ ] Notificaciones push diarias de confirmación (7:00 AM)
- [ ] Panel admin con vista de suscripciones del día
- [ ] Expansión a Facultad de Ciencias Contables (pendiente inversión S/ 3,000 del Decano)

---
*Iteración 1 — MVP Completado | Semanas 11-12 — Design Thinking + Lean Startup*
