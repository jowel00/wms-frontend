WMS-FRONTEND/ (Raíz del Repo)
├── public/              # Solo imágenes y el favicon
├── src/
│   ├── app/             # SOLO RUTAS (page.tsx, layout.tsx)
│   │   ├── products/    # Página de gestión de productos
│   │   ├── inventory/   # Página de stock
│   │   └── warehouse/   # Página de bodegas
│   ├── components/      # UI y Lógica visual
│   ├── services/        # Llamadas a la API de Spring Boot
│   ├── store/           # Estado global (Zustand)
│   └── types/           # Interfaces TS (como inventory.ts)
├── .env.local           # Variables de entorno
├── next.config.ts
├── package.json
└── README.md

# 🖥️ WMS Frontend - Smart Inventory Suite

> **Interfaz de Operación Logística para DeRocha Store.**

Este es el cliente web desarrollado en **Next.js 15** con **TypeScript**, diseñado para ser la herramienta principal de los operarios en bodega. Está optimizado para dispositivos móviles y pistolas de escaneo, priorizando la velocidad de captura sobre la estética compleja.

## 🚀 Guía de Inicio para Desarrolladores

### 1. Pre-requisitos
- **Node.js 20+** y **npm** o **pnpm**.
- Tener el **Backend (wms-core)** corriendo (vía Docker o local) para poder consumir la API.

### 2. Instalación
```bash
git clone [URL-del-repo]
cd wms-frontend
npm install

3. Configuración de Entorno
Copia el archivo de ejemplo y asegúrate de que la URL apunte a tu backend local:

cp .env.example .env.local

npm run dev

🧠 Reglas de Diseño de Interfaz (Scanner-First)
Para que el operario sea eficiente, la UI debe seguir estas reglas inquebrantables:

Foco Automático: Al cargar una pantalla de acción (ej. Recepción), el cursor debe estar automáticamente en el campo de escaneo.

Paginación Obligatoria: Dado que manejamos 20,000 referencias, está prohibido cargar listas completas. Todo listado debe usar la paginación del servidor.

Feedback Visual/Sonoro: Cada escaneo exitoso debe mostrar un indicador verde; errores de SKU o ubicación deben mostrar un rojo vibrante y, si es posible, emitir un sonido de alerta.

Target Táctil: Los botones de acción deben tener un tamaño mínimo de 44x44px para facilitar su uso con guantes.
___________________________________________________________
📂 Estructura del Proyecto
/src/components: UI Atoms (Botones, Inputs de scanner, Cards).

/src/app: Rutas y páginas (Estructuradas por dominio: /products, /inventory, /warehouse).

/src/services: Clientes de API (Axios/Fetch) centralizados.

/src/types: Interfaces de TypeScript compartidas.
___________________________________________________________
📡 Integración con Backend
El frontend consume los servicios de wms-core (Java 21 / Spring Boot 3.5.0).

Carga Masiva: POST /products/bulk-upload (Acepta archivos .csv).

Inventario: Endpoints basados en contenedores lógicos y eventos.
___________________________________________________________
Vision Boosters - Construyendo logística inteligente. 🚀