import type { Warehouse } from '@/src/types/inventory';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// El backend requiere ownerId: GET /api/v1/warehouses?ownerId=UUID
export async function fetchWarehouses(ownerId: string): Promise<Warehouse[]> {
  const res = await fetch(`${apiUrl()}/warehouses?ownerId=${ownerId}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchWarehouses: HTTP ${res.status}`);
  return res.json();
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
  if (!res.ok) throw new Error(`postWarehouse: HTTP ${res.status}`);
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
  if (!res.ok) throw new Error(`patchWarehouse: HTTP ${res.status}`);
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
  if (!res.ok) throw new Error(`patchWarehouseStatus: HTTP ${res.status}`);
  return res.json();
}
