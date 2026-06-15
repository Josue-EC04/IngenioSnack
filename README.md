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
- `/docs`: Documentación técnica del sistema.
- `/EVIDENCIAS_TDD`: Capturas del flujo Red-Green-Refactor.
- `BITACORA_PAIR_PROGRAMMING.md`: Registro de las sesiones de trabajo en pareja.
- `REFACTORIZACION.md`: Registro de los code smells solucionados y mejoras de clean code.

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
*Iteración 1 — MVP Completado*
