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
│   │   │   ├── page.tsx                   # Filtros: owner → bodega → status → bin (URL params)
│   │   │   ├── loading.tsx
│   │   │   ├── _components/
│   │   │   │   ├── ContainersClient.tsx   # Filtros en cascada + consume useContainerActions
│   │   │   │   ├── ContainersTable.tsx    # Botones Putaway/Move por status + link al detalle
│   │   │   │   ├── ContainerDialog.tsx    # Flujo RECEIVE: tipo + producto + LotSection + cantidad
│   │   │   │   ├── LotSection.tsx         # Sub-componente controlado: lote existente o nuevo (solo productos con hasExpiration)
│   │   │   │   ├── useContainerActions.ts # Hook: optimistic updates + receiveContainerAction/putaway/move
│   │   │   │   ├── PutawayDialog.tsx      # Asigna bin a contenedor CREATED → ACTIVE
│   │   │   │   ├── MoveDialog.tsx         # Mueve contenedor ACTIVE a otro bin
│   │   │   │   └── ContainerStatusBadge.tsx # CREATED/ACTIVE/CLOSED/QUARANTINE
│   │   │   │
│   │   │   └── [containerId]/             # Detalle de un contenedor — sus líneas (solo lectura)
│   │   │       ├── page.tsx               # Fetch: container + lines + products + lots; type/ownerId vía searchParams
│   │   │       ├── loading.tsx
│   │   │       └── _components/
│   │   │           ├── ContainerDetailClient.tsx  # Info del contenedor + líneas; "Volver" usa router.back()
│   │   │           └── ContainerLineCard.tsx      # Tarjeta por línea: producto, qty (Total/Disponible/Reservado), lote
│   │   │
│   │   ├── lots/                          # Gestión de Lotes (Lots)
│   │   │   ├── page.tsx                   # Carga todos los lotes, filtra por owner en servidor
│   │   │   ├── loading.tsx
│   │   │   └── _components/
│   │   │       ├── LotsClient.tsx         # OwnerGate (sin owner) + OwnerSelect rápido + optimistic
│   │   │       ├── LotsTable.tsx          # Cols: Producto | Código de Lote | Recepción | Vencimiento
│   │   │       ├── LotDialog.tsx          # Owner bloqueado → Producto → Batch Code → Fechas (con restricciones de fecha)
│   │   │       └── LotExpirationBadge.tsx # Rojo=vencido, ámbar≤30d, gris=ok
│   │   │
│   │   ├── products/                      # Gestión de Productos
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── _components/
│   │   │   │   ├── ProductsClient.tsx     # OwnerGate (sin owner) + OwnerSelect + paginado + optimistic
│   │   │   │   └── ProductDialog.tsx
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
│   │       ├── containers.ts              # receiveContainerAction + putawayContainerAction + moveContainerAction
│   │       │                              # queryContainerTypes + queryLineProducts + queryProductLots
│   │       └── lots.ts                    # createLot + queryLotProducts
│   │
│   ├── services/                          # Clientes HTTP hacia wms-core
│   │   ├── api.ts                         # apiUrl() — centraliza NEXT_PUBLIC_API_URL
│   │   ├── ownerService.ts
│   │   ├── warehouseService.ts
│   │   ├── locationService.ts             # fetchLocations + fetchAllLocations
│   │   ├── productService.ts
│   │   ├── containerService.ts            # fetchContainers + fetchContainerById (→ ContainerDetail)
│   │   │                                  # receiveContainer + putawayContainer + moveContainer
│   │   ├── containerTypeService.ts        # fetchContainerTypes — GET /container-types
│   │   ├── containerLineService.ts        # fetchContainerLines — GET /inventory/containers/:id/lines
│   │   └── lotService.ts                 # fetchLots + postLot
│   │
│   ├── types/
│   │   ├── inventory.ts                   # Product, Owner, Warehouse, Location, LocationType,
│   │   │                                  # InventoryContainer, ContainerDetail, ContainerTypeItem,
│   │   │                                  # ContainerLine, Lot, BulkUploadResponse
│   │   └── actions.ts                     # ActionResult<T> — { success: true; data: T } | { error: string }
│   │
│   └── lib/
│       ├── colombia-cities.ts
│       └── validations/
│           ├── owners.ts
│           ├── warehouses.ts
│           ├── locations.ts
│           ├── products.ts
│           ├── containers.ts              # receiveSchema + putawaySchema + moveSchema
│           └── lots.ts                   # lotSchema — validación cross-field expiresAt > receivedAt
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
│       │                                  # command, popover, sonner
│       └── propios
│           ├── container-status-badge.tsx # CREATED / ACTIVE / CLOSED / QUARANTINE
│           ├── data-table.tsx             # DataTable<T> genérico — filas fat-finger py-5
│           ├── empty-state.tsx            # Estado vacío con ícono, título y acción opcional
│           ├── owner-gate.tsx             # Gate de selección de owner: tarjetas + búsqueda (compartido)
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
    ├── useContainers.ts               # binOptions + visible — sin useMemo (React Compiler activo)
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
| `/containers` | Contenedores — filtros: `?ownerId=` → `?warehouseId=` → `?status=` → `?locationId=` (bin, solo cuando status=ACTIVE) |
| `/containers/[containerId]` | Detalle del contenedor — líneas de inventario (solo lectura) |
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
| Tipos de contenedor | `GET` | `/container-types` | Listar tipos (BOX, TOTE, PALLET) |
| Contenedores | `GET` | `/inventory/containers?warehouseId=\|status=\|locationId=` | Listar con filtro |
| Contenedores | `GET` | `/inventory/containers/:id` | Obtener detalle (`ContainerDetail`) |
| Inventario — Recibir | `POST` | `/inventory/receive` | Crea contenedor + línea, sin ubicación → CREATED |
| Inventario — Putaway | `POST` | `/inventory/containers/:id/putaway` | Asigna bin al contenedor CREATED → ACTIVE |
| Inventario — Mover | `POST` | `/inventory/containers/:id/move` | Mueve contenedor ACTIVE a otro bin |
| Líneas | `GET` | `/inventory/containers/:id/lines` | Listar líneas del contenedor (solo lectura) |
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

Los formularios invocan **Server Actions** en `src/app/actions/` que re-validan con Zod, llaman al servicio HTTP y ejecutan `revalidatePath()`. Retornan `ActionResult<T>` (definido en `src/types/actions.ts`): `{ success: true; data: T }` con la entidad creada/editada, o `{ error: string }` con el mensaje real que devuelve el backend.

### 3. Optimistic Updates (React 19)

`useOptimistic` actualiza la UI antes de recibir respuesta del servidor. Las filas optimistas tienen el prefijo `opt-` en el ID y se renderizan con `animate-pulse`. Si el servidor falla, React revierte automáticamente.

### 4. URL como fuente de verdad para filtros

Los filtros persisten en la URL vía `router.push()`. Cada cambio de selección (owner, bodega, bin) reescribe los query params, lo que permite compartir URLs con filtros aplicados.

### 5. Pre-carga única de árbol de locations

`ContainersClient` carga **todas las locations de una bodega en una sola llamada** al arrancar la página. `PutawayDialog` y `MoveDialog` reciben el array `locations[]` como prop y construyen las etiquetas jerárquicas (`PA-001 › RK-001 › BIN-001`) en cliente sin llamadas adicionales.

### 6. Columna de ubicación condicional

La tabla de contenedores oculta la columna "Ubicación" cuando hay un bin específico seleccionado en el filtro (`hideLocation={!!locationId}`), evitando información redundante. El selector de bin solo aparece cuando `status === 'ACTIVE'`.

### 7. Lazy loading de dialogs

Los dialogs se cargan con `dynamic()` solo cuando el usuario los abre por primera vez.

### 8. Streaming con Suspense

Cada ruta tiene `loading.tsx` con skeletons que replican la estructura visual. El usuario ve el layout completo mientras el Server Component resuelve los datos.

### 9. Ciclo de vida de contenedores — RECEIVE → PUTAWAY → MOVE

Los contenedores siguen un flujo explícito de operaciones de inventario:

```
RECEIVE  →  Crea contenedor + primera línea sin ubicación  →  status: CREATED
PUTAWAY  →  Asigna un bin (solo desde CREATED)             →  status: ACTIVE
MOVE     →  Reubica el contenedor a otro bin (desde ACTIVE)
```

`ContainerDialog` ejecuta el RECEIVE. `PutawayDialog` y `MoveDialog` aparecen como acciones en la tabla según el status del contenedor.

### 10. OwnerGate — pre-estado de selección de owner

Las vistas de **Productos** y **Lotes** usan un componente `OwnerGate` (`components/ui/owner-gate.tsx`) como pantalla de entrada cuando no hay `ownerId` en la URL. Muestra las tarjetas de owners activos con búsqueda, y al seleccionar uno navega a `?ownerId=<id>`. Una vez dentro, el `OwnerSelect` en el header permite cambiar de owner directamente sin volver al gate. Seleccionar "Todos los owners" en el `OwnerSelect` limpia el param y regresa al gate.

### 11. LotSection — sub-componente controlado para lotes en RECEIVE

`LotSection` encapsula toda la lógica de lote dentro del flujo de recepción de inventario. Se monta solo cuando el producto seleccionado tiene `hasExpiration = true`. Su interfaz es `onChange: (LotPayload | null) => void`; el padre (`ContainerDialog`) solo conoce si el lote está listo o no. Internamente decide entre **lote existente** (seleccionar `lotId`) o **lote nuevo** (ingresar `batchCode` + fechas), usando el patrón `onChangeRef` para evitar closures stale.

### 12. Toast notifications con Sonner

`<Toaster />` (de `components/ui/sonner.tsx`) está montado en `src/app/layout.tsx`. Los Clients llaman a `toast.success(...)` / `toast.error(...)` usando el campo `data` que retorna la Server Action para mostrar el nombre o código real de la entidad afectada (ej: `"Bin creado — PA-001 › RK-001 › BIN-001"`). Los servicios HTTP propagan el campo `message` del body de error para que el toast muestre el motivo real del backend en lugar de un genérico "HTTP 400".

---

## Tipos del Dominio (`src/types/inventory.ts`)

| Interface | Campos clave |
|---|---|
| `Owner` | `ownerId`, `name`, `status`, `createdAt?` |
| `Warehouse` | `warehouseId`, `ownerId`, `name`, `countryCode`, `city`, `status` |
| `Location` | `locationId`, `warehouseId`, `parentLocationId`, `type`, `code`, `active` |
| `LocationTypeItem` | `typeId`, `name`, `indicator`, `isActive` |
| `ContainerTypeItem` | `typeId`, `name` — entidad dinámica de `/container-types` |
| `InventoryContainer` | `containerId`, `ownerId`, `warehouseId`, `locationId` (`null` si CREATED), `type`, `status` |
| `ContainerDetail` | `containerId`, `productId`, `quantityAvailable`, `location` (código string, `null` si CREATED), `status` — shape real de `GET /inventory/containers/:id` |
| `ContainerLine` | `containerLineId`, `containerId`, `productId`, `lotId`, `qtyTotal`, `qtyAvailable`, `qtyReserved` |
| `Lot` | `lotId`, `productId`, `ownerId`, `supplierId`, `batchCode`, `expiresAt`, `receivedAt` |
| `Product` | `productId`, `ownerId`, `sellerSku`, `name`, `barcodeUpdEan?`, `requiresUnitTracking`, `hasExpiration`, `status`, `createdAt` |
| `ProductListItem` | Versión resumida de `Product` para listados paginados |

**Notas de tipos:**
- `ContainerStatus`: `'CREATED' | 'ACTIVE' | 'CLOSED' | 'QUARANTINE'`
- `ContainerType`: `'BOX' | 'TOTE' | 'PALLET'` (el backend serializa en uppercase)
- `LocationType`: `'PASILLO' | 'RACK' | 'BIN'`
- `expiresAt` / `receivedAt` en `Lot`: formato `"YYYY-MM-DD"` (Java `LocalDate`)
- `ContainerDetail` y `InventoryContainer` tienen shapes distintos — el endpoint de lista devuelve `InventoryContainer` (con `ownerId`, `warehouseId`, `type`); el endpoint de detalle devuelve `ContainerDetail` (con código de ubicación ya resuelto)

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
| Contenedores | `/containers` | ✅ Implementado | Flujo RECEIVE/PUTAWAY/MOVE + filtros owner → bodega → status → bin (bin solo cuando ACTIVE) |
| Contenedores — Detalle | `/containers/[id]` | ✅ Implementado | Solo lectura — líneas como tarjetas con qty Total/Disponible/Reservado + datos de lote |
| Lotes | `/lots` | ✅ Implementado | OwnerGate + OwnerSelect + crear lote con restricciones de fecha + tabla con badge de vencimiento |
| Productos — Catálogo | `/products` | ✅ Implementado | Listado paginado + creación individual |
| Productos — Carga masiva CSV | `/products/bulk-upload` | ✅ Implementado | Drag-and-drop + errores de validación por fila |
| Login / Autenticación | — | 🔲 Pendiente | El ownerId se integrará con la sesión |
| Movimientos de Stock | — | 🔲 Pendiente | — |
| Reportes | — | 🔲 Pendiente | — |

### Limitaciones conocidas

| Limitación | Impacto | Ubicación |
|---|---|---|
| `GET /lots` sin filtro por owner | Se cargan todos los lotes y se filtra en cliente | `LotService.getAllLots` — usar `findByOwner_OwnerId` en backend |

---

*Vision Boosters — Construyendo logística inteligente.*
