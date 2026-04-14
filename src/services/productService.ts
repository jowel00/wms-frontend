import type { BulkUploadResponse, ProductListItem } from '@/src/types/inventory';

// ─── Listado paginado de productos ───────────────────────────────────────────

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  /** Término de búsqueda — coincide contra sellerSku y name en el backend */
  q?: string;
  ownerId?: string;
}

export interface ProductsListResponse {
  data: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

// Forma que devuelve el backend (Spring Page)
interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-indexed
}

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<ProductsListResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');

  const { page = 1, limit = 10, q, ownerId } = params;

  // El backend requiere ownerId obligatoriamente — sin él retornamos vacío
  if (!ownerId) {
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }

  // El backend usa paginación 0-indexed
  const sp = new URLSearchParams({
    page: String(page - 1),
    limit: String(limit),
    ownerId,
  });
  if (q) sp.set('q', q);

  const res = await fetch(`${apiUrl}/products?${sp.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Error al cargar productos: HTTP ${res.status}`);

  const body = (await res.json()) as SpringPage<ProductListItem>;

  return {
    data: body.content,
    total: body.totalElements,
    page: body.number + 1, // convertir a 1-indexed para el frontend
    totalPages: body.totalPages,
  };
}

// ─── Creación individual de producto ─────────────────────────────────────────

export interface CreateProductPayload {
  ownerId: string;
  sellerSku: string;
  name: string;
  barcodeUpcEan?: string;
  requiresUnitTracking: boolean;
  hasExpiration: boolean;
}

export async function createProduct(payload: CreateProductPayload): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');

  const body: Record<string, unknown> = {
    ownerId: payload.ownerId,
    sellerSku: payload.sellerSku,
    name: payload.name,
    requiresUnitTracking: payload.requiresUnitTracking,
    hasExpiration: payload.hasExpiration,
  };
  if (payload.barcodeUpcEan) body.barcodeUpcEan = payload.barcodeUpcEan;

  const res = await fetch(`${apiUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(
      detail?.message ?? `Error al crear producto: HTTP ${res.status}`
    );
  }
}

// Shape del error de validación individual que devuelve el backend
export interface BulkUploadValidationError {
  row: number | null;
  field: string;
  message: string;
}

// Shape de error que devuelve el backend en respuestas 4xx/5xx
// Ej: { status: 400, code: "CSV_VALIDATION_ERROR", message: "...", errors: [...] }
export interface BulkUploadErrorPayload {
  status?: number;
  code?: string;
  message?: string;
  error?: string;
  errors?: BulkUploadValidationError[];
}

export class BulkUploadError extends Error {
  constructor(public readonly payload: BulkUploadErrorPayload) {
    super(payload.message ?? 'Error en carga masiva');
    this.name = 'BulkUploadError';
  }
}

export async function bulkUpload(file: File): Promise<BulkUploadResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');

  const formData = new FormData();
  // TODO: remover ownerId hardcodeado — solo para pruebas
  formData.append('ownerId', '66121a09-0334-4dca-a510-7f818730443a');
  formData.append('file', file);

  const response = await fetch(`${apiUrl}/products/bulk-upload`, {
    method: 'POST',
    body: formData,
  });

  // Intentar parsear el cuerpo siempre — tanto en éxito como en error
  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    // El backend puede devolver { message, errors[] } o { error, message } u otros formatos
    const errorPayload: BulkUploadErrorPayload = responseBody ?? {
      message: `Error del servidor (HTTP ${response.status})`,
    };
    throw new BulkUploadError(errorPayload);
  }

  return responseBody as BulkUploadResponse;
}