import type { Warehouse } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

// El backend requiere ownerId: GET /api/v1/warehouses?ownerId=UUID
export async function fetchWarehouses(ownerId: string): Promise<Warehouse[]> {
  const res = await fetch(`${apiUrl()}/warehouses?ownerId=${ownerId}`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}

export async function fetchAllWarehouses(ownerIds: string[]): Promise<Warehouse[]> {
  const results = await Promise.all(ownerIds.map((id) => fetchWarehouses(id).catch(() => [])));
  return results.flat();
}

// Backend acepta: { ownerId, name, countryCode, city } — NO incluye country
export async function postWarehouse(data: {
  name: string;
  city: string;
  countryCode: string;
  ownerId: string;
}): Promise<Warehouse> {
  const res = await fetch(`${apiUrl()}/warehouses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

export async function patchWarehouse(
  id: string,
  data: { name: string; city: string; countryCode: string; ownerId: string }
): Promise<Warehouse> {
  const res = await fetch(`${apiUrl()}/warehouses/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

export async function patchWarehouseStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<Warehouse> {
  const res = await fetch(`${apiUrl()}/warehouses/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  await throwIfError(res);
  return res.json();
}
