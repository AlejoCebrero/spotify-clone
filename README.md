# 🎵 Spotify Clone — Trabajo Final Programación III

Clon simplificado de Spotify desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js), siguiendo una arquitectura **MVC** en el backend. Permite registro y autenticación de usuarios, gestión completa de un catálogo de canciones, búsqueda (interna y mediante una API externa), y creación/administración de playlists personales.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación y puesta en marcha](#-instalación-y-puesta-en-marcha)
- [Variables de entorno](#-variables-de-entorno)
- [Modelo de datos](#-modelo-de-datos)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Decisiones de diseño](#-decisiones-de-diseño)
- [Posibles mejoras futuras](#-posibles-mejoras-futuras)

## ✨ Funcionalidades

- **Autenticación de usuarios**: registro y login con contraseñas hasheadas (bcrypt) y sesión gestionada con JSON Web Tokens (JWT).
- **CRUD completo de canciones**: creación, lectura, edición y borrado, con lectura pública y escritura protegida por autenticación.
- **Buscador de canciones**: búsqueda interna por título/artista/género (con coincidencias parciales), y búsqueda externa integrando la **iTunes Search API**, con opción de importar resultados al catálogo propio.
- **Playlists**: creación, listado, detalle con canciones pobladas, agregar/quitar canciones, y borrado — todo restringido al usuario dueño de cada playlist.
- **API REST** documentada, construida sobre Express, con separación por capas (Models, Controllers, Routes, Middlewares, Services).

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React (Vite), React Router, Axios, Context API |
| Backend | Node.js, Express |
| Base de datos | MongoDB Atlas, Mongoose (ODM) |
| Autenticación | JSON Web Tokens (jsonwebtoken), bcryptjs |
| API externa | iTunes Search API |
| Control de versiones | Git / GitHub (ramas `main` y `develop`) |

## 🏗 Arquitectura

El backend sigue el patrón **MVC (Model-View-Controller)**, adaptado a una API REST (sin View tradicional, reemplazada por las respuestas JSON):

```
backend/
├── src/
│   ├── models/          # Esquemas de Mongoose (User, Song, Playlist)
│   ├── controllers/      # Lógica de negocio de cada endpoint
│   ├── routes/           # Definición de endpoints (verbo HTTP + URL)
│   ├── middlewares/       # Funciones intermedias (autenticación JWT)
│   ├── services/         # Comunicación con servicios externos (iTunes API)
│   ├── config/            # Conexión a la base de datos
│   └── app.js             # Configuración central de Express
├── server.js               # Punto de entrada, arranca el servidor
└── .env                     # Variables de entorno (no versionado)

frontend/
├── src/
│   ├── components/       # Piezas de UI reutilizables (Navbar, ProtectedRoute)
│   ├── pages/             # Pantallas completas (Login, Songs, Playlists)
│   ├── context/            # AuthContext (estado global de sesión)
│   ├── services/           # Funciones que consumen la API propia
│   └── App.jsx              # Definición de rutas
```

**Flujo de una petición típica:**

```
React (componente) 
  → Service (axios) 
    → Express Route 
      → Middleware (verifica JWT, si aplica) 
        → Controller (lógica) 
          → Model (Mongoose) 
            → MongoDB Atlas
```

## 🚀 Instalación y puesta en marcha

### Requisitos previos
- Node.js (LTS) instalado
- Una base de datos en MongoDB Atlas (o instancia local de MongoDB)

### Backend

```bash
cd backend
npm install
# Crear un archivo .env (ver sección Variables de entorno)
npm run dev
```

El servidor queda disponible en `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## 🔐 Variables de entorno

Crear un archivo `.env` dentro de `backend/` con:

```
PORT=5000
MONGO_URI=<cadena de conexión a tu base de MongoDB Atlas>
JWT_SECRET=<una clave secreta larga y aleatoria>
```

## 🗄 Modelo de datos

- **User**: `username`, `email`, `password` (hasheada).
- **Song**: `title`, `artist`, `album`, `duration` (segundos), `genre`.
- **Playlist**: `name`, `user` (referencia a User), `songs` (array de referencias a Song).

Las relaciones se modelan mediante referencias (`ObjectId` + `ref`), no embedding, para evitar duplicación de datos compartidos entre múltiples documentos.

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Protegido |
|---|---|---|---|
| POST | `/api/auth/register` | Registro de usuario | No |
| POST | `/api/auth/login` | Login (devuelve JWT) | No |
| GET | `/api/songs` | Listar canciones (admite filtros `?title=`, `?artist=`, `?genre=`) | No |
| GET | `/api/songs/:id` | Ver una canción | No |
| POST | `/api/songs` | Crear canción | Sí |
| PUT | `/api/songs/:id` | Editar canción | Sí |
| DELETE | `/api/songs/:id` | Borrar canción | Sí |
| GET | `/api/songs/external/search?term=` | Buscar canciones en iTunes | No |
| POST | `/api/playlists` | Crear playlist | Sí |
| GET | `/api/playlists` | Listar mis playlists | Sí |
| GET | `/api/playlists/:id` | Ver playlist (con canciones pobladas) | Sí |
| PUT | `/api/playlists/:id/add` | Agregar canción a playlist | Sí |
| PUT | `/api/playlists/:id/remove` | Quitar canción de playlist | Sí |
| DELETE | `/api/playlists/:id` | Borrar playlist | Sí |

## 🎯 Decisiones de diseño

- **Referencias en vez de embedding**: se eligieron referencias entre Playlist–User y Playlist–Song para evitar duplicación de datos que se comparten entre múltiples documentos.
- **Lectura pública, escritura protegida (Songs)**: el catálogo de canciones es de consulta abierta, como en una app de streaming real; solo crear/editar/borrar requiere autenticación.
- **Autorización por dueño (Playlists)**: además de requerir autenticación, cada operación de modificación sobre una playlist valida que el usuario autenticado sea efectivamente su dueño (403 Forbidden en caso contrario).
- **Capa de Service para la API externa**: la integración con iTunes se aisló en una capa de Service, para que el Controller no dependa de los detalles de un proveedor externo específico.
- **Vite en vez de Create React App**: por ser el estándar actual recomendado, con arranque más rápido.

## 🔮 Posibles mejoras futuras

- Extraer el chequeo de "dueño de la playlist", actualmente repetido en varios controllers, a una función auxiliar o middleware dedicado.
- Implementar *debounce* en la búsqueda interna en vivo, para reducir peticiones innecesarias al backend.
- Migrar la conexión a MongoDB a la variante `mongodb+srv://` estándar (se usó una alternativa sin DNS SRV por una limitación puntual del entorno de desarrollo).
- Roles de usuario (por ejemplo, administrador) para gestión avanzada del catálogo.