// ─── Producto ────────────────────────────────────────────────────────────────
// Refleja ProductResponse (GET /api/v1/products/{id} y POST /api/v1/products)
export interface Product {
  productId: string;           // UUID
  ownerId: string;             // UUID
  sellerSku: string;
  name: string;
  /** Nota: el backend serializa este campo como "barcodeUpdEan" (posible typo) */
  barcodeUpdEan?: string;
  requiresUnitTracking: boolean;
  hasExpiration: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;           // Instant → ISO-8601 string
}

// Refleja ProductListResponse (GET /api/v1/products — paginado)
export interface ProductListItem {
  productId: string;
  sellerSku: string;
  name: string;
  barcodeUpcEan?: string;
  requiresUnitTracking: boolean;
  hasExpiration: boolean;
}

// ─── Owner ────────────────────────────────────────────────────────────────────
// Refleja la entidad Owner tal como la serializa el backend
// (POST /api/v1/owners y GET /api/v1/owners/{id})
export interface Owner {
  ownerId: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;          // Instant → ISO-8601 string (el backend no siempre lo devuelve)
}

// ─── Warehouse ────────────────────────────────────────────────────────────────
// Refleja WarehouseResponse — status: ACTIVE por defecto al crear
// Nota: el backend NO devuelve `country`, solo `countryCode`
export interface Warehouse {
  warehouseId: string;
  ownerId: string;
  name: string;
  countryCode: string;
  city: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// ─── LocationType ─────────────────────────────────────────────────────────────
// Refleja LocationTypeResponse: GET /api/v1/location-types
export interface LocationTypeItem {
  typeId: string;
  name: string;
  indicator: string;
  isActive: boolean;
}

// ─── Location ─────────────────────────────────────────────────────────────────
export type LocationType = 'PASILLO' | 'RACK' | 'BIN';

// Refleja LocationResponse: el backend retorna `active: boolean`, no `status`
export interface Location {
  locationId: string;
  warehouseId: string;
  parentLocationId: string | null;
  type: LocationType;
  code: string;
  active: boolean;             // boolean directo del backend
}

// ─── InventoryContainer ───────────────────────────────────────────────────────
// ContainerStatus refleja el enum ContainerStatus del backend
export type ContainerStatus = 'CREATED' | 'ACTIVE' | 'CLOSED' | 'QUARANTINE';
// El mapper guarda el tipo en lowercase; los valores válidos son box, tote, pallet
export type ContainerType = 'box' | 'tote' | 'pallet';

export const CONTAINER_TYPE_LABELS: Record<string, string> = {
  box: 'Caja',
  tote: 'Tote',
  pallet: 'Pallet',
};

// Refleja InventoryContainerResponse — el backend NO incluye createdAt ni closedAt
export interface InventoryContainer {
  containerId: string;        // UUID
  ownerId: string;            // UUID
  warehouseId: string;        // UUID
  locationId: string;         // UUID
  type: string;               // lowercase: "box" | "tote" | "pallet"
  status: ContainerStatus;
}

// ─── ContainerLine ────────────────────────────────────────────────────────────
// Refleja ContainerLineResponse
export interface ContainerLine {
  containerLineId: string;
  containerId: string;
  productId: string;
  lotId: string | null;
  qtyTotal: number;
  qtyAvailable: number;
  qtyReserved: number;
}

// ─── Lot ──────────────────────────────────────────────────────────────────────
// Refleja LotResponse — LocalDate serializa como "YYYY-MM-DD"
export interface Lot {
  lotId: string;
  productId: string;
  ownerId: string;
  supplierId: string | null;
  batchCode: string | null;
  expiresAt: string | null;
  receivedAt: string | null;
}

// ─── Carga Masiva ─────────────────────────────────────────────────────────────
// Refleja la respuesta de POST /api/v1/products/bulk-upload
export interface BulkUploadResponse {
  message: string;
  productsCreated: number;     // era "count" — nombre correcto del backend
}