import type { Lot } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

// GET /api/v1/lots — devuelve todos los lotes (filtrar por ownerId en cliente)
export async function fetchLots(): Promise<Lot[]> {
  const res = await fetch(`${apiUrl()}/lots`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}

// POST /api/v1/lots
export async function postLot(data: {
  ownerId: string;
  productId: string;
  batchCode: string;
  expiresAt?: string;
  receivedAt?: string;
}): Promise<Lot> {
  const res = await fetch(`${apiUrl()}/lots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}
