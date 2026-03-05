import type { Location } from '@/src/types/inventory';
import { MOCK_LOCATIONS } from '@/src/lib/mock-data';

const USE_MOCK = process.env.USE_MOCK === 'true';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

export async function fetchLocations(warehouseId?: string): Promise<Location[]> {
  if (USE_MOCK) {
    return warehouseId
      ? MOCK_LOCATIONS.filter((l) => l.warehouseId === warehouseId)
      : MOCK_LOCATIONS;
  }
  const url = warehouseId
    ? `${apiUrl()}/locations?warehouseId=${warehouseId}`
    : `${apiUrl()}/locations`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchLocations: HTTP ${res.status}`);
  return res.json();
}

export async function postLocation(data: {
  code: string;
  type: string;
  aisle?: string;
  rack?: string;
  bin?: string;
  warehouseId: string;
}): Promise<Location> {
  if (USE_MOCK) {
    return {
      locationId: `mock-${Date.now()}`,
      code: data.code,
      type: data.type as Location['type'],
      aisle: data.aisle,
      rack: data.rack,
      bin: data.bin,
      warehouseId: data.warehouseId,
      status: 'ACTIVE',
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
  data: { code: string; type: string; aisle?: string; rack?: string; bin?: string; warehouseId: string }
): Promise<Location> {
  if (USE_MOCK) {
    const existing = MOCK_LOCATIONS.find((l) => l.locationId === id);
    return { ...existing!, ...data, type: data.type as Location['type'] };
  }
  const res = await fetch(`${apiUrl()}/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`patchLocation: HTTP ${res.status}`);
  return res.json();
}

export async function patchLocationStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<Location> {
  if (USE_MOCK) {
    const existing = MOCK_LOCATIONS.find((l) => l.locationId === id);
    return { ...existing!, status };
  }
  const res = await fetch(`${apiUrl()}/locations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`patchLocationStatus: HTTP ${res.status}`);
  return res.json();
}
