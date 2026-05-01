import type { Location, LocationTypeItem } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

// El backend sólo filtra por warehouseId: GET /api/v1/locations?warehouseId=UUID
// El filtrado por parentLocationId se hace en el cliente.
export async function fetchLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  const res = await fetch(`${apiUrl()}/locations?warehouseId=${warehouseId}`, { cache: 'no-store' });
  await throwIfError(res);
  const data: Location[] = await res.json();
  if (parentLocationId === undefined) return data.filter((l) => l.parentLocationId === null);
  return data.filter((l) => l.parentLocationId === parentLocationId);
}

// Devuelve TODAS las locations de la bodega sin filtrar por nivel
export async function fetchAllLocations(warehouseId: string): Promise<Location[]> {
  const res = await fetch(`${apiUrl()}/locations?warehouseId=${warehouseId}`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}

// GET /api/v1/location-types — lista todos los tipos de ubicación disponibles
export async function fetchLocationTypes(): Promise<LocationTypeItem[]> {
  const res = await fetch(`${apiUrl()}/location-types`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}

// Backend requiere { warehouseId, typeId, parentLocationId? } — el código se genera automáticamente
export async function postLocation(data: {
  warehouseId: string;
  typeId: string;
  parentLocationId?: string | null;
}): Promise<Location> {
  const res = await fetch(`${apiUrl()}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      warehouseId: data.warehouseId,
      typeId: data.typeId,
      parentLocationId: data.parentLocationId ?? null,
    }),
  });
  await throwIfError(res);
  return res.json();
}

// El único endpoint de mutación de location es PATCH /locations/{id}/deactivate (sin body, 204)
export async function deactivateLocation(id: string): Promise<void> {
  const res = await fetch(`${apiUrl()}/locations/${id}/deactivate`, { method: 'PATCH' });
  await throwIfError(res);
}
