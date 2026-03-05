import type { Owner } from '@/src/types/inventory';
import { MOCK_OWNERS } from '@/src/lib/mock-data';

const USE_MOCK = process.env.USE_MOCK === 'true';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

export async function fetchOwners(): Promise<Owner[]> {
  if (USE_MOCK) return MOCK_OWNERS;
  const res = await fetch(`${apiUrl()}/owners`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchOwners: HTTP ${res.status}`);
  return res.json();
}

export async function postOwner(data: { name: string }): Promise<Owner> {
  if (USE_MOCK) {
    return { ownerId: `mock-${Date.now()}`, name: data.name, status: 'ACTIVE', skuCount: 0 };
  }
  const res = await fetch(`${apiUrl()}/owners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`postOwner: HTTP ${res.status}`);
  return res.json();
}

export async function patchOwner(id: string, data: { name: string }): Promise<Owner> {
  if (USE_MOCK) {
    const existing = MOCK_OWNERS.find((o) => o.ownerId === id);
    return { ...existing!, ...data };
  }
  const res = await fetch(`${apiUrl()}/owners/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`patchOwner: HTTP ${res.status}`);
  return res.json();
}

export async function patchOwnerStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<Owner> {
  if (USE_MOCK) {
    const existing = MOCK_OWNERS.find((o) => o.ownerId === id);
    return { ...existing!, status };
  }
  const res = await fetch(`${apiUrl()}/owners/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`patchOwnerStatus: HTTP ${res.status}`);
  return res.json();
}
