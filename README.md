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
| Validación | Zod |
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
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── OwnersClient.tsx
│   │   │       ├── OwnersTable.tsx
│   │   │       ├── OwnerDialog.tsx
│   │   │       └── OwnerStatusToggle.tsx
│   │   │
│   │   ├── warehouses/                    # Gestión de Bodegas (Warehouses)
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── WarehousesClient.tsx
│   │   │       ├── WarehousesTable.tsx
│   │   │       └── WarehouseDialog.tsx
│   │   │
│   │   ├── locations/                     # Gestión de Ubicaciones
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── LocationsClient.tsx
│   │   │       ├── LocationsTable.tsx
│   │   │       ├── LocationDialog.tsx
│   │   │       ├── LocationTypeBadge.tsx
│   │   │       ├── WarehouseSelector.tsx
│   │   │       └── DrilldownBreadcrumb.tsx
│   │   │
│   │   ├── containers/                    # Gestión de Contenedores de Inventario
│   │   │   ├── page.tsx                   # Filtros: owner → bodega → bin (URL params)
│   │   │   ├── loading.tsx
│   │   │   ├── _components/
│   │   │   │   ├── ContainersClient.tsx   # Filtros en cascada + optimistic
│   │   │   │   ├── ContainersTable.tsx    # Columna ubicación condicional + link al detalle
│   │   │   │   ├── ContainerDialog.tsx    # Carga árbol de locations en 1 sola llamada
│   │   │   │   └── ContainerStatusBadge.tsx # CREATED/ACTIVE/CLOSED/QUARANTINE
│   │   │   │
│   │   │   └── [containerId]/             # Detalle de un contenedor — sus líneas
│   │   │       ├── page.tsx               # Fetch: container + lines + products + lots
│   │   │       ├── loading.tsx
│   │   │       └── _components/
│   │   │           ├── ContainerDetailClient.tsx  # Info del contenedor + optimistic lines
│   │   │           ├── ContainerLinesTable.tsx    # Tabla: producto, lote, qty
│   │   │           └── AddLineDialog.tsx          # Producto → Lote (filtrado) → Cantidad
│   │   │
│   │   ├── lots/                          # Gestión de Lotes (Lots)
│   │   │   ├── page.tsx                   # Carga todos los lotes, filtra por owner en servidor
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── LotsClient.tsx         # Filtro por owner + optimistic
│   │   │       ├── LotsTable.tsx          # Tabla con lookup de producto + badge de vencimiento
│   │   │       ├── LotDialog.tsx          # Owner → Producto → Batch Code → Fechas
│   │   │       └── LotExpirationBadge.tsx # Rojo=vencido, ámbar≤30d, gris=ok
│   │   │
│   │   ├── products/                      # Gestión de Productos
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── _components/
│   │   │   │   ├── ProductsClient.tsx
│   │   │   │   ├── ProductDialog.tsx
│   │   │   │   └── ProductOwnerFilter.tsx
│   │   │   └── bulk-upload/
│   │   │       ├── page.tsx
│   │   │       ├── BulkUploadForm.tsx
│   │   │       └── _components/
│   │   │           ├── DropZone.tsx
│   │   │           ├── Toast.tsx
│   │   │           └── UploadResult.tsx
│   │   │
│   │   └── actions/                       # Server Actions
│   │       ├── owners.ts
│   │       ├── warehouses.ts
│   │       ├── locations.ts
│   │       ├── products.ts
│   │       ├── containers.ts              # createContainer + queryAllContainersLocations
│   │       ├── lots.ts                    # createLot + queryLotProducts
│   │       └── containerLines.ts         # createContainerLine + queryLineProducts + queryLineLots
│   │
│   ├── services/                          # Clientes HTTP hacia wms-core
│   │   ├── ownerService.ts
│   │   ├── warehouseService.ts
│   │   ├── locationService.ts             # fetchLocations + fetchAllLocations
│   │   ├── productService.ts
│   │   ├── containerService.ts            # fetchContainers + fetchContainerById + postContainer
│   │   ├── containerLineService.ts        # fetchContainerLines + postContainerLine
│   │   └── lotService.ts                 # fetchLots + postLot
│   │
│   ├── types/
│   │   └── inventory.ts                   # Product, Owner, Warehouse, Location, LocationType,
│   │                                      # InventoryContainer, ContainerLine, Lot, BulkUploadResponse
│   │
│   └── lib/
│       ├── colombia-cities.ts
│       └── validations/
│           ├── owners.ts
│           ├── warehouses.ts
│           ├── locations.ts
│           ├── products.ts
│           ├── containers.ts              # containerSchema
│           ├── lots.ts                   # lotSchema — validación cross-field expiresAt > receivedAt
│           └── containerLines.ts         # containerLineSchema — qtyTotal min 1
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx
│   │   ├── navConfig.ts                   # Hrefs: /owners /warehouses /locations /containers /lots
│   │   └── Sidebar.tsx                    # Nav: Dashboard, Owners, Bodegas, Ubicaciones,
│   │                                      #      Contenedores, Lotes, Productos, Carga Masiva
│   │
│   └── ui/
│       ├── shadcn (vía CLI)               # button, badge, dialog, form, input, label, select,
│       │                                  # separator, skeleton, switch, table, tooltip,
│       │                                  # command, popover
│       └── propios
│           ├── action-error.tsx           # Bloque de error reutilizable para Server Actions
│           ├── container-status-badge.tsx # CREATED / ACTIVE / CLOSED / QUARANTINE
│           ├── data-table.tsx             # DataTable<T> genérico — filas fat-finger py-5
│           ├── empty-state.tsx            # Estado vacío con ícono, título y acción opcional
│           ├── owner-select.tsx           # Select de owner controlado (sin routing interno)
│           ├── page-header.tsx            # Encabezado de página: section + title + description
│           ├── paginator.tsx              # Paginación numérica
│           ├── search-input.tsx           # Input h-14 con spinner Loader2 mientras isPending
│           ├── status-badge.tsx           # ACTIVE (verde) / INACTIVE (secondary)
│           ├── status-toggle.tsx          # Switch genérico — onToggle: (active) => Promise<ActionResult>
│           └── table-skeleton.tsx         # Filas skeleton para loading.tsx
│
└── hooks/
    ├── useOwners.ts
    ├── useWarehouses.ts
    ├── useDebounce.ts
    └── useTheme.ts
```

---

## Rutas Disponibles

| Ruta | Descripción |
|---|---|
| `/` | Dashboard / página de inicio |
| `/owners` | CRUD de owners |
| `/warehouses` | CRUD de bodegas, filtrable por owner |
| `/locations` | CRUD de ubicaciones — requiere `?warehouseId=` |
| `/containers` | Contenedores — filtros: `?ownerId=` → `?warehouseId=` → `?locationId=` (bin) |
| `/containers/[containerId]` | Detalle del contenedor — líneas de inventario (ContainerLines) |
| `/lots` | Lotes de productos — filtrable por `?ownerId=` |
| `/products` | Catálogo de productos paginado — requiere `?ownerId=` |
| `/products/bulk-upload` | Carga masiva de catálogo vía CSV |

---

## Integración con Backend (wms-core)

La URL base se configura en `.env.local` con `NEXT_PUBLIC_API_URL`.

### Endpoints consumidos

| Recurso | Método | Endpoint | Descripción |
|---|---|---|---|
| Owners | `GET` | `/owners` | Listar todos |
| Owners | `POST` | `/owners` | Crear |
| Owners | `PATCH` | `/owners/:id` | Editar |
| Owners | `PATCH` | `/owners/:id/status` | Cambiar estado |
| Bodegas | `GET` | `/warehouses?ownerId=` | Listar por owner |
| Bodegas | `POST` | `/warehouses` | Crear |
| Bodegas | `PATCH` | `/warehouses/:id` | Editar |
| Bodegas | `PATCH` | `/warehouses/:id/status` | Cambiar estado |
| Ubicaciones | `GET` | `/locations?warehouseId=` | Listar todas (incluye pasillos, racks y bins) |
| Ubicaciones | `POST` | `/locations` | Crear |
| Tipos de ubicación | `GET` | `/location-types` | Listar tipos disponibles |
| Contenedores | `GET` | `/inventory-containers?warehouseId=` | Listar por bodega |
| Contenedores | `GET` | `/inventory-containers?locationId=` | Listar por bin |
| Contenedores | `GET` | `/inventory-containers/:id` | Obtener por ID |
| Contenedores | `POST` | `/inventory-containers` | Crear |
| Líneas | `GET` | `/inventory-containers/:id/lines` | Listar líneas del contenedor |
| Líneas | `POST` | `/inventory-containers/:id/lines` | Agregar línea |
| Lotes | `GET` | `/lots` | Listar todos (filtro por owner en cliente) |
| Lotes | `POST` | `/lots` | Crear lote |
| Productos | `GET` | `/products?ownerId=&page=&limit=&q=` | Listar paginado |
| Productos | `POST` | `/products` | Crear individual |
| Productos | `POST` | `/products/bulk-upload` | Carga masiva CSV |

---

## Arquitectura y Patrones Clave

### 1. Server / Client boundary

```
page.tsx (Server Component — fetch de datos)
  └── *Client.tsx ('use client' — estado, optimistic, dialogs)
        └── Componentes de UI (tabla, dialogs, badges)
```

### 2. Server Actions

Los formularios invocan **Server Actions** en `src/app/actions/` que re-validan con Zod, llaman al servicio HTTP y ejecutan `revalidatePath()`. Siempre retornan `{ success: true } | { error: string }`.

### 3. Optimistic Updates (React 19)

`useOptimistic` actualiza la UI antes de recibir respuesta del servidor. Las filas optimistas tienen el prefijo `opt-` en el ID y se renderizan con `animate-pulse`. Si el servidor falla, React revierte automáticamente.

### 4. URL como fuente de verdad para filtros

Los filtros persisten en la URL vía `router.push()`. Cada cambio de selección (owner, bodega, bin) reescribe los query params, lo que permite compartir URLs con filtros aplicados.

### 5. Pre-carga única de árbol de locations

El `ContainerDialog` carga **todas las locations de una bodega en una sola llamada** al abrir, luego filtra pasillos → racks → bins en cliente sin llamadas adicionales. Esto elimina los 3 spinners encadenados del patrón anterior.

### 6. Columna de ubicación condicional

La tabla de contenedores oculta la columna "Ubicación" cuando hay un bin específico seleccionado en el filtro (`showLocationColumn={!locationId}`), evitando información redundante.

### 7. Lazy loading de dialogs

Los dialogs se cargan con `dynamic()` solo cuando el usuario los abre por primera vez.

### 8. Streaming con Suspense

Cada ruta tiene `loading.tsx` con skeletons que replican la estructura visual. El usuario ve el layout completo mientras el Server Component resuelve los datos.

---

## Tipos del Dominio (`src/types/inventory.ts`)

| Interface | Campos clave |
|---|---|
| `Owner` | `ownerId`, `name`, `status`, `createdAt?` |
| `Warehouse` | `warehouseId`, `ownerId`, `name`, `countryCode`, `city`, `status` |
| `Location` | `locationId`, `warehouseId`, `parentLocationId`, `type`, `code`, `active` |
| `LocationTypeItem` | `typeId`, `name`, `indicator`, `isActive` |
| `InventoryContainer` | `containerId`, `ownerId`, `warehouseId`, `locationId`, `type`, `status` |
| `ContainerLine` | `containerLineId`, `containerId`, `productId`, `lotId`, `qtyTotal`, `qtyAvailable`, `qtyReserved` |
| `Lot` | `lotId`, `productId`, `ownerId`, `supplierId`, `batchCode`, `expiresAt`, `receivedAt` |
| `Product` | `productId`, `ownerId`, `sellerSku`, `name`, `barcodeUpdEan?`, `requiresUnitTracking`, `hasExpiration`, `status`, `createdAt` |
| `ProductListItem` | Versión resumida de `Product` para listados paginados |

**Notas de tipos:**
- `ContainerStatus`: `'CREATED' | 'ACTIVE' | 'CLOSED' | 'QUARANTINE'`
- `ContainerType`: `'box' | 'tote' | 'pallet'` (el backend almacena en minúsculas)
- `LocationType`: `'PASILLO' | 'RACK' | 'BIN'`
- `expiresAt` / `receivedAt` en `Lot`: formato `"YYYY-MM-DD"` (Java `LocalDate`)

---

## Sistema de Diseño — "Logistics Precision"

### Colores (`globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#0072C2` | Steel Blue — botones, acciones primarias |
| `--brand-accent` | `#FF8D39` | Safety Amber — alertas, acentos |
| `--background` | `#F4F6F9` | Concrete Gray — fondo de página |
| Sidebar | `#1B2A3B` | Deep Navy — navegación lateral |

### Reglas UI Fat-Finger

| Elemento | Especificación |
|---|---|
| Botones de acción | `h-14 px-6 text-base font-bold uppercase tracking-wider` |
| Inputs y Selects | `h-14 text-base` |
| Items de Select | `py-3` |
| Filas de tabla | `py-5` (via `DataTable`) |
| Cabecera de tabla | `py-4 text-xs font-bold uppercase tracking-widest bg-muted/40` |

### Alias de rutas (`tsconfig.json`)

```
@/*  →  ./  (raíz del proyecto, NO src/)
```

Los archivos bajo `src/` se importan con `@/src/`. No mover archivos de `src/` a la raíz sin actualizar todos los imports.

---

## Estado Actual del Proyecto

| Pantalla | Ruta | Estado | Notas |
|---|---|---|---|
| Owners | `/owners` | ✅ Implementado | CRUD completo + optimistic updates |
| Bodegas | `/warehouses` | ✅ Implementado | CRUD completo + filtro por owner |
| Ubicaciones | `/locations` | ✅ Implementado | CRUD completo + selector de bodega obligatorio |
| Contenedores | `/containers` | ✅ Implementado | Filtros owner → bodega → bin + optimistic |
| Contenedores — Detalle (Líneas) | `/containers/[id]` | ✅ Implementado | Tabla de ContainerLines + agregar línea con lote opcional |
| Lotes | `/lots` | ✅ Implementado | Crear lote + tabla con badge de vencimiento |
| Productos — Catálogo | ✅ Implementado | Listado paginado + creación individual |
| Productos — Carga masiva CSV | ✅ Implementado | Drag-and-drop + errores de validación por fila |
| Login / Autenticación | 🔲 Pendiente | El ownerId se integrará con la sesión |
| Movimientos de Stock | 🔲 Pendiente | — |
| Reportes | 🔲 Pendiente | — |

### Bugs conocidos (pendientes en backend)

| Bug | Impacto | Archivo |
|---|---|---|
| `receivedAt` no se persiste en Lot | El campo se envía pero siempre llega `null` en la respuesta | `LotMapper.toDomain` — no recibe el parámetro |
| `GET /lots` sin filtro por owner | Se cargan todos los lotes y se filtra en cliente | `LotService.getAllLots` — usar `findByOwner_OwnerId` |

---

*Vision Boosters — Construyendo logística inteligente.*
