# WMS Frontend — Smart Inventory Suite

> **Interfaz de Operación Logística para DeRocha Store.**
> Cliente web en **Next.js + TypeScript** para operarios de bodega, optimizado para uso con guantes, pantallas táctiles y mouse en escritorio.

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

## Estructura del Proyecto

```
wms-frontend/
│
├── src/
│   ├── app/                          # Rutas — App Router de Next.js
│   │   ├── layout.tsx                # Layout raíz (wrappea MainLayout)
│   │   ├── page.tsx                  # Dashboard con KPIs y acciones rápidas
│   │   │
│   │   ├── owners/                   # Pantalla: Gestión de Owners
│   │   │   ├── page.tsx              # Server Component — fetch de datos
│   │   │   ├── loading.tsx           # Skeleton de carga (Suspense streaming)
│   │   │   └── _components/
│   │   │       ├── OwnersClient.tsx  # Boundary cliente — estado, optimistic, dialogo
│   │   │       ├── OwnersTable.tsx   # Tabla usando DataTable genérico
│   │   │       ├── OwnerDialog.tsx   # Formulario crear/editar (lazy loaded)
│   │   │       └── OwnerStatusToggle.tsx  # Switch optimista con rollback
│   │   │
│   │   ├── bodegas/                  # Pantalla: Gestión de Bodegas (Warehouses)
│   │   │   ├── page.tsx              # Server Component — fetch paralelo (bodegas + owners)
│   │   │   ├── loading.tsx           # Skeleton de carga
│   │   │   └── _components/
│   │   │       ├── BodegasClient.tsx      # Boundary cliente — estado, filtros, optimistic
│   │   │       ├── BodegasTable.tsx       # Tabla usando DataTable genérico
│   │   │       ├── BodegaDialog.tsx       # Formulario crear/editar (lazy loaded)
│   │   │       ├── BodegaStatusToggle.tsx # Switch optimista con rollback
│   │   │       └── OwnerFilterSelect.tsx  # Select que filtra por owner y escribe URL
│   │   │
│   │   ├── ubicaciones/              # Pantalla: Gestión de Ubicaciones
│   │   │   ├── page.tsx              # Server Component — fetch condicional por warehouseId
│   │   │   ├── loading.tsx           # Skeleton de carga
│   │   │   └── _components/
│   │   │       ├── UbicacionesClient.tsx      # Boundary cliente — gated UI, estado, optimistic
│   │   │       ├── UbicacionesTable.tsx       # Tabla usando DataTable genérico
│   │   │       ├── UbicacionDialog.tsx        # Formulario crear/editar (lazy loaded)
│   │   │       ├── LocationStatusToggle.tsx   # Switch optimista con rollback
│   │   │       ├── LocationTypeBadge.tsx      # Badge de color por tipo de ubicación
│   │   │       └── WarehouseSelector.tsx      # Select obligatorio — escribe warehouseId en URL
│   │   │
│   │   ├── products/
│   │   │   └── bulk-upload/          # Pantalla: Carga Masiva de Catálogo CSV
│   │   │       ├── page.tsx
│   │   │       ├── BulkUploadForm.tsx
│   │   │       └── _components/
│   │   │           ├── DropZone.tsx
│   │   │           ├── Toast.tsx
│   │   │           └── UploadResult.tsx
│   │   │
│   │   ├── actions/                  # Server Actions (Next.js)
│   │   │   ├── owners.ts             # createOwner, updateOwner, toggleOwnerStatus
│   │   │   ├── warehouses.ts         # createWarehouse, updateWarehouse, toggleWarehouseStatus
│   │   │   └── locations.ts          # createLocation, updateLocation, toggleLocationStatus
│   │   │
│   │   └── globals.css               # Tokens de diseño (colores, radios, sidebar)
│   │
│   ├── lib/
│   │   ├── mock-data.ts              # Datos mock: owners, bodegas, ubicaciones
│   │   └── validations/
│   │       ├── owners.ts             # Zod schema — ownerSchema
│   │       ├── warehouses.ts         # Zod schema — warehouseSchema
│   │       └── locations.ts          # Zod schema — locationSchema
│   │
│   ├── services/                     # Clientes HTTP hacia wms-core
│   │   ├── ownerService.ts           # fetchOwners, postOwner, patchOwner, patchOwnerStatus
│   │   ├── warehouseService.ts       # fetchWarehouses, postWarehouse, patchWarehouse...
│   │   ├── locationService.ts        # fetchLocations(warehouseId?), postLocation...
│   │   └── productService.ts         # bulkUpload
│   │
│   └── types/
│       └── inventory.ts              # Interfaces del dominio: Product, Owner, Warehouse, Location
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx            # Client component — gestiona colapso del sidebar
│   │   └── Sidebar.tsx               # Navegación con zone-rail signature (borde izquierdo activo)
│   │
│   └── ui/                           # Componentes de interfaz (shadcn + propios)
│       ├── data-table.tsx            # DataTable<T> genérico — fat-finger, cabecera azul
│       ├── table-skeleton.tsx        # Skeleton de tabla para loading states
│       ├── search-input.tsx          # Input de búsqueda — h-14, spinner de transición
│       ├── status-badge.tsx          # Badge ACTIVO (verde) / INACTIVO (gris)
│       ├── empty-state.tsx           # Vista vacía — ícono grande + CTA fat-finger
│       ├── button.tsx                # shadcn
│       ├── badge.tsx                 # shadcn
│       ├── dialog.tsx                # shadcn
│       ├── form.tsx                  # shadcn (react-hook-form integration)
│       ├── input.tsx                 # shadcn
│       ├── label.tsx                 # shadcn
│       ├── select.tsx                # shadcn
│       ├── separator.tsx             # shadcn
│       ├── skeleton.tsx              # shadcn
│       ├── switch.tsx                # shadcn
│       ├── table.tsx                 # shadcn
│       └── tooltip.tsx               # shadcn
│
└── hooks/
    ├── useOwners.ts                  # Filtro fuzzy de owners (useMemo + includes)
    ├── useWarehouses.ts              # Filtro fuzzy + filtro por ownerId
    └── useLocations.ts               # Filtro fuzzy por código, tipo, pasillo, rack, bin
```

---

## Rutas Disponibles

| Ruta | Descripción |
|---|---|
| `/` | Dashboard con KPIs y acceso rápido a operaciones |
| `/owners` | CRUD de owners (multi-tenancy) |
| `/bodegas` | CRUD de bodegas, filtrable por owner |
| `/ubicaciones` | CRUD de ubicaciones, selección obligatoria de bodega |
| `/products/bulk-upload` | Carga masiva de catálogo vía CSV |

---

## Integración con Backend (wms-core)

### Endpoints consumidos

| Recurso | Método | Endpoint | Descripción |
|---|---|---|---|
| Owners | `GET` | `/owners` | Listar todos los owners |
| Owners | `POST` | `/owners` | Crear owner |
| Owners | `PATCH` | `/owners/:id` | Editar nombre |
| Owners | `PATCH` | `/owners/:id/status` | Cambiar estado ACTIVE/INACTIVE |
| Bodegas | `GET` | `/warehouses` | Listar todas las bodegas |
| Bodegas | `POST` | `/warehouses` | Crear bodega |
| Bodegas | `PATCH` | `/warehouses/:id` | Editar bodega |
| Bodegas | `PATCH` | `/warehouses/:id/status` | Cambiar estado |
| Ubicaciones | `GET` | `/locations?warehouseId=` | Listar ubicaciones de una bodega |
| Ubicaciones | `POST` | `/locations` | Crear ubicación |
| Ubicaciones | `PATCH` | `/locations/:id` | Editar ubicación |
| Ubicaciones | `PATCH` | `/locations/:id/status` | Cambiar estado |
| Catálogo | `POST` | `/products/bulk-upload` | Carga masiva CSV (multipart) |

---

## Arquitectura y Patrones

### 1. Server / Client boundary

Cada ruta sigue el mismo patrón de tres capas:

```
page.tsx (Server Component)
  └── *Client.tsx (Client boundary — 'use client')
        └── Tabla / Dialogs / Toggles
```

El `page.tsx` carga los datos en el servidor y los pasa como props al Client. El Client nunca hace fetch directo; consume lo que recibe y gestiona estado de UI.

### 2. Server Actions

Los formularios no llaman a la API directamente. Invocan **Server Actions** que:
1. Re-validan los datos con Zod (defensa en profundidad)
2. Llaman al servicio HTTP correspondiente
3. Ejecutan `revalidatePath()` para refrescar los datos del Server Component
4. Retornan `{ success: true } | { error: string }` — nunca lanzan excepciones

```typescript
// Ejemplo: src/app/actions/owners.ts
export async function createOwner(data: unknown): Promise<ActionResult> {
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

Los Client components usan `useOptimistic` para actualizar la UI antes de que responda el servidor:

```typescript
// 1. useOptimistic recibe la lista real como fuente de verdad
const [optimisticOwners, dispatchOptimistic] = useOptimistic(owners, reducer);

// 2. El hook de filtrado recibe la lista optimista como fuente de datos
const { search, setSearch, filtered } = useOwners(optimisticOwners, initialSearch);

// 3. Al crear: la fila aparece inmediatamente con efecto pulse
startTransition(async () => {
  dispatchOptimistic({ type: 'add', owner: tempOwner });
  const result = await createOwner(data);
  if ('error' in result) setActionError(result.error);
  // Si hay error, React revierte el estado optimista automáticamente
});
```

> **Importante:** El hook de filtrado debe recibir `optimisticOwners` (no `owners`) para que la búsqueda refleje los cambios optimistas en tiempo real. Usar dos instancias del hook es incorrecto porque `useState` solo toma el valor inicial una vez.

### 4. Hooks de filtrado

Los hooks son utilidades puras de filtrado — no hacen fetch, no tienen side effects:

```typescript
// hooks/useOwners.ts
export function useOwners(owners: Owner[], initialSearch = '') {
  const [search, setSearch] = useState(initialSearch);
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return owners;
    return owners.filter((o) => o.name.toLowerCase().includes(q));
  }, [owners, search]);
  return { search, setSearch, filtered };
}
```

La búsqueda se envuelve en `startTransition` en el Client para no bloquear la interfaz:

```typescript
function handleSearch(value: string) {
  startSearchTransition(() => setSearch(value));
}
```

### 5. URL como fuente de verdad para filtros

Los filtros de búsqueda y selección persisten en la URL:

- `SearchInput` escribe el parámetro `q` con `router.replace()`
- `OwnerFilterSelect` escribe el parámetro `ownerId`
- `WarehouseSelector` escribe el parámetro `warehouseId`
- El `page.tsx` lee `searchParams` y pasa los valores iniciales al Client

Esto permite compartir URLs con filtros aplicados y que el estado sobreviva a recargas.

### 6. Code splitting — Lazy dialogs

Los dialogs se cargan solo cuando el usuario hace clic por primera vez, reduciendo el bundle inicial:

```typescript
const OwnerDialog = dynamic(
  () => import('./OwnerDialog').then((m) => m.OwnerDialog),
  { loading: () => null }
);
```

### 7. Streaming con Suspense

Cada ruta tiene su propio `loading.tsx` con skeletons que replican la estructura visual de la página. El usuario ve el layout inmediatamente mientras el Server Component resuelve los datos.

---

## Sistema de Diseño — "Logistics Precision"

### Colores (definidos en `globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--primary` | `#0072C2` | Steel Blue — botones, cabeceras de tabla, acciones primarias |
| `--brand-accent` | `#FF8D39` | Safety Amber — alertas, acentos secundarios |
| `--background` | `#F4F6F9` | Concrete Gray — fondo de página |
| `--sidebar` | `#1B2A3B` | Deep Navy — fondo del sidebar |

### Alias de rutas (`tsconfig.json`)

```
@/*  →  ./  (raíz del proyecto, NO src/)
```

Ejemplos:
- `@/components/ui/button` → `./components/ui/button.tsx`
- `@/hooks/useOwners` → `./hooks/useOwners.ts`
- `@/src/services/ownerService` → `./src/services/ownerService.ts`

### Reglas de UI Fat-Finger

La interfaz está optimizada para operarios con guantes:

| Elemento | Especificación |
|---|---|
| Botones de acción | `h-14 text-base font-bold uppercase tracking-wider` |
| Inputs en formularios | `h-14 text-base` |
| Selects | `h-14 text-base` con items de `py-3` |
| Filas de tabla | `py-5` (vía `DataTable`) |
| Cabecera de tabla | Fondo `bg-primary` (azul), texto blanco |
| Separadores de fila | `border-primary/10` (azul suave, sin hover) |
| SearchInput | `h-14 pl-12` con ícono Search o Loader2 cuando filtra |

### Signature Visual — Zone-Rail

El ítem activo del sidebar muestra una barra vertical de `3px` a la izquierda (`bg-sidebar-primary rounded-r-full`). Representa la cinta de demarcación de zonas en piso de bodega.

---

## Mock Data

Para desarrollo de UI sin backend, activar `USE_MOCK=true` en `.env.local`. Los datos viven en `src/lib/mock-data.ts`:

| Entidad | Cantidad | Detalle |
|---|---|---|
| Owners | 4 | 3 activos, 1 inactivo |
| Bodegas | 5 | Bogotá, Medellín, Barranquilla, Cali, Bucaramanga |
| Ubicaciones | 15 | Distribuidas en 3 bodegas, todos los tipos de ubicación |

**Limitación del modo mock:** Los cambios de estado y creaciones son optimistas en memoria — se revierten al recargar la página. Para probar flujos cruzados entre vistas (ej. desactivar un owner y ver su efecto en `/bodegas`) se requiere el backend real.

---

## Estado Actual del Proyecto

| Pantalla | Estado | Notas |
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
