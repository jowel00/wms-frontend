import type { Location } from '@/src/types/inventory';
import { MOCK_LOCATIONS } from '@/src/lib/mock-data';

const USE_MOCK = process.env.USE_MOCK === 'true';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// parentLocationId:
//   undefined → top-level (pasillos, parent IS NULL)
//   string    → children of that location (racks or bins)
export async function fetchLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  if (USE_MOCK) {
    return MOCK_LOCATIONS.filter((l) => {
      if (l.warehouseId !== warehouseId) return false;
      if (parentLocationId === undefined) return l.parentLocationId === null;
      return l.parentLocationId === parentLocationId;
    });
  }
  const params = new URLSearchParams({ warehouseId });
  if (parentLocationId !== undefined) params.set('parentLocationId', parentLocationId);
  const res = await fetch(`${apiUrl()}/locations?${params}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchLocations: HTTP ${res.status}`);
  const data = await res.json();
  // Map active boolean → status string if backend sends { active: boolean }
  return data.map((l: Location & { active?: boolean }) =>
    l.active !== undefined ? { ...l, status: l.active ? 'ACTIVE' : 'INACTIVE' } : l
  );
}

export async function postLocation(data: {
  warehouseId: string;
  type: string;
  parentLocationId?: string | null;
}): Promise<Location> {
  if (USE_MOCK) {
    return {
      locationId: `mock-${Date.now()}`,
      warehouseId: data.warehouseId,
      type: data.type as Location['type'],
      code: '···',
      parentLocationId: data.parentLocationId ?? null,
      status: 'INACTIVE',
    };
  }
  const res = await fetch(`${apiUrl()}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`postLocation: HTTP ${res.status}`);
  return res.json();
}

export async function patchLocation(
  id: string,
  data: { warehouseId: string; type: string; parentLocationId?: string | null; code?: string }
): Promise<Location> {
  if (USE_MOCK) {
    const existing = MOCK_LOCATIONS.find((l) => l.locationId === id);
    const merged: Location = {
      ...existing!,
      ...data,
      // Preserve existing code if not provided in the patch payload
      code: data.code ?? existing!.code,
      type: data.type as Location['type'],
    };
    return merged;
  }
  const res = await fetch(`${apiUrl()}/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`patchLocation: HTTP ${res.status}`);
  return res.json();
}
