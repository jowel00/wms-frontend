# WMS Frontend — Smart Inventory Suite
> Interfaz de operación logística para **DeRocha Store**.
> Cliente web en **Next.js + TypeScript** para operarios de bodega, optimizado para uso con guantes, pantallas táctiles y escritorio.

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Componentes | shadcn/ui v3.8.5 (base Slate) |
| Lenguaje | TypeScript 5 (strict mode) |
| Formularios | react-hook-form + zod |
| Optimización | React Compiler (`babel-plugin-react-compiler`) |
| Backend | wms-core — Java 21 / Spring Boot 3.5.0 |

---

## Guía de Inicio Rápido

### Pre-requisitos

- **Node.js 20+**
- Backend **wms-core** corriendo en `http://localhost:8080`

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

### Build de producción

```bash
npm run build
npm start
```

---

Docker Setup

Asegúrate de que wms-core esté corriendo antes de iniciar el frontend.

# Levanta el backend (desde el repositorio wms-core)
docker compose up -d

# Verifica que el servicio responda
curl http://localhost:8080/api/v1/health

El frontend lee la variable NEXT_PUBLIC_API_URL para apuntar al backend. Para producción, configúrala en tu pipeline de CI/CD o en tu plataforma de despliegue (Vercel, Railway, etc.).

---

## Estructura del Proyecto

```
wms-frontend/
│
├── src/
│   ├── app/                               # Rutas — App Router de Next.js
│   │   ├── layout.tsx                     # Layout raíz (envuelve MainLayout)
│   │   ├── page.tsx                       # Dashboard / página de inicio
│   │   ├── globals.css                    # Tokens de diseño (colores, radios)
│   │   │
│   │   ├── owners/                        # Gestión de Owners
│   │   │   ├── page.tsx                   # Server Component — fetch de datos
│   │   │   ├── loading.tsx                # Skeleton de carga (Suspense)
│   │   │   └── _components/
│   │   │       ├── OwnersClient.tsx       # Boundary cliente — estado, optimistic
│   │   │       ├── OwnersTable.tsx        # Tabla con DataTable genérico
│   │   │       ├── OwnerDialog.tsx        # Formulario crear/editar (lazy loaded)
│   │   │       └── OwnerStatusToggle.tsx  # Switch optimista con rollback
│   │   │
│   │   ├── bodegas/                       # Gestión de Bodegas (Warehouses)
│   │   │   ├── page.tsx                   # Server Component — fetch paralelo
│   │   │   ├── loading.tsx                # Skeleton de carga
│   │   │   └── _components/
│   │   │       ├── BodegasClient.tsx      # Boundary cliente — filtros, optimistic
│   │   │       ├── BodegasTable.tsx       # Tabla con DataTable genérico
│   │   │       ├── BodegaDialog.tsx       # Formulario crear/editar (lazy loaded)
│   │   │       ├── BodegaStatusToggle.tsx # Switch optimista con rollback
│   │   │       └── OwnerFilterSelect.tsx  # Select que filtra por owner y escribe URL
│   │   │
│   │   ├── ubicaciones/                   # Gestión de Ubicaciones
│   │   │   ├── page.tsx                   # Server Component — fetch por warehouseId
│   │   │   ├── loading.tsx                # Skeleton de carga
│   │   │   └── _components/
│   │   │       ├── UbicacionesClient.tsx      # Boundary cliente — gated UI, optimistic
│   │   │       ├── UbicacionesTable.tsx       # Tabla con DataTable genérico
│   │   │       ├── UbicacionDialog.tsx        # Formulario crear/editar (lazy loaded)
│   │   │       ├── LocationStatusToggle.tsx   # Switch optimista con rollback
│   │   │       ├── LocationTypeBadge.tsx      # Badge por tipo de ubicación
│   │   │       └── WarehouseSelector.tsx      # Selector obligatorio de bodega (escribe URL)
│   │   │
│   │   ├── products/                      # Gestión de Productos
│   │   │   ├── page.tsx                   # Server Component — fetch paginado por owner
│   │   │   ├── loading.tsx                # Skeleton de carga
│   │   │   ├── _components/
│   │   │   │   ├── ProductsClient.tsx     # Boundary cliente — gate de owner, tabla, optimistic
│   │   │   │   ├── ProductDialog.tsx      # Formulario crear producto (lazy loaded)
│   │   │   │   └── ProductOwnerFilter.tsx # Select de owner que escribe URL
│   │   │   │
│   │   │   └── bulk-upload/               # Carga Masiva de Catálogo CSV
│   │   │       ├── page.tsx
│   │   │       ├── BulkUploadForm.tsx     # Formulario con drag-and-drop y manejo de errores
│   │   │       └── _components/
│   │   │           ├── DropZone.tsx       # Zona de arrastre de archivo
│   │   │           ├── Toast.tsx          # Notificación flotante
│   │   │           └── UploadResult.tsx   # Panel de éxito / errores de validación con tabla
│   │   │
│   │   └── actions/                       # Server Actions
│   │       ├── owners.ts                  # createOwner, updateOwner, toggleOwnerStatus
│   │       ├── warehouses.ts              # createWarehouse, updateWarehouse, toggleWarehouseStatus
│   │       ├── locations.ts               # createLocation, updateLocation, toggleLocationStatus
│   │       └── products.ts                # createProductAction
│   │
│   ├── services/                          # Clientes HTTP hacia wms-core
│   │   ├── ownerService.ts                # fetchOwners, postOwner, patchOwner, patchOwnerStatus
│   │   ├── warehouseService.ts            # fetchWarehouses, postWarehouse, patchWarehouse...
│   │   ├── locationService.ts             # fetchLocations, postLocation, patchLocation...
│   │   └── productService.ts              # fetchProducts, createProduct, bulkUpload
│   │
│   ├── types/
│   │   └── inventory.ts                   # Interfaces del dominio: Product, Owner, Warehouse, Location...
│   │
│   └── lib/
│       ├── colombia-cities.ts             # Lista de ciudades de Colombia (selector en bodegas)
│       └── validations/
│           ├── owners.ts                  # Zod schema — ownerSchema
│           ├── warehouses.ts              # Zod schema — warehouseSchema
│           ├── locations.ts               # Zod schema — locationSchema
│           └── products.ts                # Zod schema — productSchema
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx                 # Client component — gestiona colapso del sidebar
│   │   └── Sidebar.tsx                    # Navegación principal con zone-rail signature
│   │
│   └── ui/                                # Componentes de interfaz reutilizables
│       ├── shadcn (instalados vía CLI)
│       │   ├── button.tsx
│       │   ├── badge.tsx
│       │   ├── command.tsx
│       │   ├── dialog.tsx
│       │   ├── form.tsx
│       │   ├── input.tsx
│       │   ├── label.tsx
│       │   ├── popover.tsx
│       │   ├── select.tsx
│       │   ├── separator.tsx
│       │   ├── skeleton.tsx
│       │   ├── switch.tsx
│       │   ├── table.tsx
│       │   └── tooltip.tsx
│       │
│       └── propios
│           ├── data-table.tsx             # DataTable<T> genérico — fat-finger, filas py-5
│           ├── table-skeleton.tsx         # Skeleton de tabla para loading states
│           ├── search-input.tsx           # Input de búsqueda h-14 con spinner de transición
│           ├── status-badge.tsx           # Badge ACTIVO (verde) / INACTIVO (gris)
│           ├── empty-state.tsx            # Vista vacía — ícono + CTA fat-finger
│           └── paginator.tsx              # Paginador con variante compact y full
│
└── hooks/
    ├── useOwners.ts                       # Filtro fuzzy de owners en memoria
    ├── useWarehouses.ts                   # Filtro fuzzy + filtro por ownerId
    ├── useDebounce.ts                     # Debounce genérico para búsquedas
    └── useTheme.ts                        # Gestión de tema (light/dark)
```

---

## Rutas Disponibles

| Ruta | Descripción |
|---|---|
| `/` | Dashboard / página de inicio |
| `/owners` | CRUD de owners |
| `/bodegas` | CRUD de bodegas, filtrable por owner |
| `/ubicaciones` | CRUD de ubicaciones — requiere seleccionar bodega (`?warehouseId=`) |
| `/products` | Catálogo de productos — requiere seleccionar owner (`?ownerId=`) |
| `/products/bulk-upload` | Carga masiva de catálogo vía CSV |

---

## Integración con Backend (wms-core)

La URL base se configura en `.env.local` con `NEXT_PUBLIC_API_URL`.

### Endpoints consumidos

| Recurso | Método | Endpoint | Descripción |
|---|---|---|---|
| Owners | `GET` | `/owners` | Listar todos los owners |
| Owners | `POST` | `/owners` | Crear owner |
| Owners | `PATCH` | `/owners/:id` | Editar nombre |
| Owners | `PATCH` | `/owners/:id/status` | Cambiar estado ACTIVE/INACTIVE |
| Bodegas | `GET` | `/warehouses` | Listar bodegas |
| Bodegas | `POST` | `/warehouses` | Crear bodega |
| Bodegas | `PATCH` | `/warehouses/:id` | Editar bodega |
| Bodegas | `PATCH` | `/warehouses/:id/status` | Cambiar estado |
| Ubicaciones | `GET` | `/locations?warehouseId=` | Listar ubicaciones de una bodega |
| Ubicaciones | `POST` | `/locations` | Crear ubicación |
| Ubicaciones | `PATCH` | `/locations/:id` | Editar ubicación |
| Ubicaciones | `PATCH` | `/locations/:id/status` | Cambiar estado |
| Tipos de ubicación | `GET` | `/location-types` | Listar tipos disponibles |
| Productos | `GET` | `/products?ownerId=&page=&limit=&q=` | Listar productos paginados |
| Productos | `POST` | `/products` | Crear producto individual |
| Productos | `POST` | `/products/bulk-upload` | Carga masiva CSV (multipart/form-data) |

### Estructura de error estándar del backend

El frontend parsea y muestra al usuario los errores con esta forma:

```json
{
  "status": 400,
  "code": "CSV_VALIDATION_ERROR",
  "message": "El CSV contiene 3 error(es) de validación",
  "errors": [
    { "row": 5, "field": "seller_sku", "message": "SKU 'ABC-001' ya existe para este owner" },
    { "row": 12, "field": "name", "message": "El nombre no puede estar vacío" }
  ]
}
```

---

## Arquitectura y Patrones Clave

### 1. Server / Client boundary

Cada ruta sigue el mismo patrón de tres capas:

```
page.tsx (Server Component)
  └── *Client.tsx ('use client' — estado, optimistic, dialogs)
        └── Componentes de UI (tabla, dialogs, toggles)
```

El `page.tsx` carga los datos en el servidor y los pasa como props al Client. El Client nunca hace fetch directo; consume lo que recibe y gestiona el estado de UI.

### 2. Server Actions

Los formularios no llaman a la API directamente. Invocan **Server Actions** en `src/app/actions/` que:

1. Re-validan los datos con Zod
2. Llaman al servicio HTTP correspondiente
3. Ejecutan `revalidatePath()` para refrescar los datos del Server Component
4. Retornan `{ success: true } | { error: string }` — nunca lanzan excepciones al cliente

```typescript
// src/app/actions/owners.ts
export async function createOwnerAction(data: unknown): Promise<ActionResult> {
  const parsed = ownerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postOwner(parsed.data);
    revalidatePath('/owners');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear owner' };
  }
}
```

### 3. Optimistic Updates (React 19)

Los Client components usan `useOptimistic` para actualizar la UI antes de que responda el servidor. Si el servidor retorna un error, React revierte el estado automáticamente.

Las filas optimistas se identifican por el prefijo `opt-` en el ID y se renderizan con `animate-pulse` mientras están pendientes:

```typescript
const [optimisticItems, dispatchOptimistic] = useOptimistic(items, reducer);

startTransition(async () => {
  dispatchOptimistic({ type: 'add', item: tempItem }); // UI actualiza ya
  const result = await createAction(data);
  if ('error' in result) setActionError(result.error); // revert si falla
});
```

### 4. URL como fuente de verdad para filtros

Los filtros y selecciones persisten en la URL vía `router.replace()`:

- `SearchInput` escribe el parámetro `q`
- `ProductOwnerFilter` / `OwnerFilterSelect` escriben `ownerId`
- `WarehouseSelector` escribe `warehouseId`

El `page.tsx` lee `searchParams` y pasa los valores iniciales al Client, lo que permite compartir URLs con filtros aplicados y que el estado sobreviva a recargas.

### 5. Pantallas "gate" por selección obligatoria

`/products` y `/ubicaciones` requieren que el usuario seleccione un owner o una bodega antes de mostrar datos. Cuando el parámetro no está en la URL, el Client renderiza una pantalla de selección con tarjetas clickeables en lugar de mostrar una tabla vacía.

### 6. Lazy loading de dialogs

Los dialogs se cargan solo cuando el usuario los abre por primera vez, reduciendo el bundle inicial:

```typescript
const ProductDialog = dynamic(
  () => import('./ProductDialog').then((m) => m.ProductDialog),
  { loading: () => null }
);
```

### 7. Streaming con Suspense

Cada ruta tiene su propio `loading.tsx` con skeletons que replican la estructura visual de la página. El usuario ve el layout completo de inmediato mientras el Server Component resuelve los datos del backend.

---

## Sistema de Diseño — "Logistics Precision"

### Colores (definidos en `globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#0072C2` | Steel Blue — botones, cabeceras de tabla, acciones primarias |
| `--brand-accent` | `#FF8D39` | Safety Amber — alertas, acentos secundarios |
| `--background` | `#F4F6F9` | Concrete Gray — fondo de página |
| Sidebar | `#1B2A3B` | Deep Navy — fondo de navegación lateral |

### Alias de rutas (`tsconfig.json`)

```
@/*  →  ./  (raíz del proyecto, NO src/)
```

| Import | Ruta real |
|---|---|
| `@/components/ui/button` | `./components/ui/button.tsx` |
| `@/hooks/useOwners` | `./hooks/useOwners.ts` |
| `@/src/services/ownerService` | `./src/services/ownerService.ts` |
| `@/src/types/inventory` | `./src/types/inventory.ts` |

> Los archivos bajo `src/` se importan con el prefijo `@/src/`. No mover archivos de `src/` a la raíz sin actualizar todos los imports.

### Reglas de UI Fat-Finger

La interfaz está optimizada para uso con guantes o pantallas táctiles:

| Elemento | Especificación |
|---|---|
| Botones de acción | `h-14 px-6 text-base font-bold uppercase tracking-wider` |
| Inputs y Selects en formularios | `h-14 text-base` |
| Items de Select | `py-3` |
| Filas de tabla | `py-5` (via `DataTable`) |
| Cabecera de tabla | `py-4 text-xs font-bold uppercase tracking-widest bg-muted/40` |
| SearchInput | `h-14 pl-12` con Loader2 cuando hay transición activa |

### Signature Visual — Zone-Rail

El ítem activo del sidebar muestra una barra vertical de `3px` a la izquierda (`bg-sidebar-primary rounded-r-full`), que representa la cinta de demarcación de zonas en piso de bodega.

---

## Estado Actual del Proyecto

| Pantalla | Estado | Notas |
|---|---|---|
| Owners | ✅ Implementado | CRUD completo + optimistic updates |
| Bodegas | ✅ Implementado | CRUD completo + filtro por owner + selector de ciudad |
| Ubicaciones | ✅ Implementado | CRUD completo + selector de bodega obligatorio |
| Productos — Catálogo | ✅ Implementado | Listado paginado, creación individual, gate de owner |
| Productos — Carga masiva CSV | ✅ Implementado | Drag-and-drop, errores de validación por fila |
| Login / Autenticación | 🔲 Pendiente | El ownerId se integrará con la sesión del usuario al implementar auth |
Pantalla | Estado | Notas |
|---|---|---|
| Dashboard | ✅ Implementado | KPIs placeholder, accesos rápidos |
| Carga Masiva CSV | ✅ Implementado | Conectado a `/products/bulk-upload` |
| Owners | ✅ Implementado | CRUD completo + optimistic updates |
| Bodegas | ✅ Implementado | CRUD completo + filtro por owner |
| Ubicaciones | ✅ Implementado | CRUD completo + selector de bodega obligatorio |
| Recepciones | 🔲 Pendiente | — |
| Movimientos de Stock | 🔲 Pendiente | — |
| Reportes | 🔲 Pendiente | — |

---

*Vision Boosters — Construyendo logística inteligente.*
