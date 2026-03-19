import type { Location, LocationTypeItem } from '@/src/types/inventory';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// El backend sólo filtra por warehouseId: GET /api/v1/locations?warehouseId=UUID
// El filtrado por parentLocationId se hace en el cliente.
export async function fetchLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  const res = await fetch(`${apiUrl()}/locations?warehouseId=${warehouseId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchLocations: HTTP ${res.status}`);
  const data: Location[] = await res.json();
  if (parentLocationId === undefined) return data.filter((l) => l.parentLocationId === null);
  return data.filter((l) => l.parentLocationId === parentLocationId);
}

// GET /api/v1/location-types — lista todos los tipos de ubicación disponibles
export async function fetchLocationTypes(): Promise<LocationTypeItem[]> {
  const res = await fetch(`${apiUrl()}/location-types`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchLocationTypes: HTTP ${res.status}`);
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
  if (!res.ok) throw new Error(`postLocation: HTTP ${res.status}`);
  return res.json();
}

// El único endpoint de mutación de location es PATCH /locations/{id}/deactivate (sin body, 204)
export async function deactivateLocation(id: string): Promise<void> {
  const res = await fetch(`${apiUrl()}/locations/${id}/deactivate`, { method: 'PATCH' });
  if (!res.ok) throw new Error(`deactivateLocation: HTTP ${res.status}`);
}
