# WMS Frontend — Smart Inventory Suite

> **Interfaz de Operación Logística para DeRocha Store.**
> Cliente web en **Next.js** + **TypeScript** para operarios de bodega, optimizado para dispositivos móviles y pistolas de escaneo.

---

## Tech Stack

| Capa             | Tecnología                                      |
|------------------|-------------------------------------------------|
| Framework        | Next.js 16.1.6 (App Router)                     |
| UI               | React 19 + Tailwind CSS v4                      |
| Lenguaje         | TypeScript 5 (strict mode)                      |
| Optimización     | React Compiler (`babel-plugin-react-compiler`)  |
| Backend          | wms-core — Java 21 / Spring Boot 3.5.0          |

---

## Estructura del Proyecto

```
src/
├── app/                   # Rutas (App Router de Next.js)
│   ├── page.tsx           # Dashboard principal
│   ├── layout.tsx         # Layout raíz
│   └── products/
│       └── bulk-upload/   # HU: Carga masiva de catálogo
├── components/            # Componentes UI reutilizables
├── services/              # Clientes HTTP hacia wms-core
│   └── productService.ts  # bulkUpload, manejo de errores
├── store/                 # Estado global (Zustand — próximamente)
└── types/
    └── inventory.ts       # Interfaces del dominio (Product, Owner, BulkUploadResponse)
```

---

## Guía de Inicio Rápido

### Pre-requisitos

- **Node.js 20+**
- Backend **wms-core** corriendo (local o Docker) en `http://localhost:8080`

### Instalación

```bash
git clone <URL-del-repo>
cd wms-frontend
npm install
```

### Configuración de Entorno

```bash
cp .env.example .env.local
# Edita .env.local y ajusta la URL del backend:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Desarrollo

```bash
npm run dev   # http://localhost:3000
```

### Build de Producción

```bash
npm run build
npm start
```

---

## Docker Setup

> Asegúrate de que `wms-core` esté corriendo antes de iniciar el frontend.

```bash
# Levanta el backend (desde el repositorio wms-core)
docker compose up -d

# Verifica que el servicio responda
curl http://localhost:8080/api/v1/health
```

El frontend lee la variable `NEXT_PUBLIC_API_URL` para apuntar al backend. Para producción, configúrala en tu pipeline de CI/CD o en tu plataforma de despliegue (Vercel, Railway, etc.).

---

## Principios de Diseño — Scanner-First UI

Esta interfaz está construida para operarios que trabajan con **pistolas de escaneo y guantes**. Cada decisión de UX sigue estas reglas:

| Principio                  | Implementación                                                                    |
|----------------------------|-----------------------------------------------------------------------------------|
| **Foco Automático**        | El cursor se posiciona en el campo de escaneo al cargar cada pantalla de acción   |
| **Paginación Obligatoria** | Prohibido cargar listas completas. Todo listado usa paginación del servidor (20 K+ referencias) |
| **Feedback Visual**        | Escaneo exitoso → verde; SKU/ubicación inválidos → rojo vibrante + alerta sonora  |
| **Target Táctil**          | Botones con tamaño mínimo de 44 × 44 px para uso con guantes                     |

---

## Integración con Backend (wms-core)

| Endpoint                | Método             | Descripción                       |
|-------------------------|--------------------|-----------------------------------|
| `/products/bulk-upload` | `POST` (multipart) | Carga masiva de catálogo vía CSV  |
| `/inventory`            | `GET`              | Consulta de stock por contenedor  |

---

## Rutas Disponibles

| Ruta                    | Descripción                                  |
|-------------------------|----------------------------------------------|
| `/`                     | Dashboard con indicadores y accesos rápidos  |
| `/products/bulk-upload` | Carga masiva de catálogo CSV                 |

---

*Vision Boosters — Construyendo logística inteligente.*
