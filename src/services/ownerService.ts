import type { Owner } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

export async function fetchOwners(): Promise<Owner[]> {
  const res = await fetch(`${apiUrl()}/owners`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}

export async function postOwner(data: { name: string }): Promise<Owner> {
  const res = await fetch(`${apiUrl()}/owners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

export async function patchOwner(id: string, data: { name: string }): Promise<Owner> {
  const res = await fetch(`${apiUrl()}/owners/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

export async function patchOwnerStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<Owner> {
  const res = await fetch(`${apiUrl()}/owners/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  await throwIfError(res);
  return res.json();
}
