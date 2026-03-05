import type { Warehouse } from '@/src/types/inventory';
import { MOCK_WAREHOUSES } from '@/src/lib/mock-data';

const USE_MOCK = process.env.USE_MOCK === 'true';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

export async function fetchWarehouses(): Promise<Warehouse[]> {
  if (USE_MOCK) return MOCK_WAREHOUSES;
  const res = await fetch(`${apiUrl()}/warehouses`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchWarehouses: HTTP ${res.status}`);
  return res.json();
}

export async function postWarehouse(data: {
  name: string;
  city: string;
  country: string;
  countryCode: string;
  ownerId: string;
}): Promise<Warehouse> {
  if (USE_MOCK) {
    return { warehouseId: `mock-${Date.now()}`, status: 'ACTIVE', ...data };
  }
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
  data: { name: string; city: string; country: string; countryCode: string; ownerId: string }
): Promise<Warehouse> {
  if (USE_MOCK) {
    const existing = MOCK_WAREHOUSES.find((w) => w.warehouseId === id);
    return { ...existing!, ...data };
  }
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
  if (USE_MOCK) {
    const existing = MOCK_WAREHOUSES.find((w) => w.warehouseId === id);
    return { ...existing!, status };
  }
  const res = await fetch(`${apiUrl()}/warehouses/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`patchWarehouseStatus: HTTP ${res.status}`);
  return res.json();
}
