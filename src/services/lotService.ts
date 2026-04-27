import type { Lot } from '@/src/types/inventory';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// GET /api/v1/lots — devuelve todos los lotes (filtrar por ownerId en cliente)
export async function fetchLots(): Promise<Lot[]> {
  const res = await fetch(`${apiUrl()}/lots`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetchLots: HTTP ${res.status}`);
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
  if (!res.ok) throw new Error(`postLot: HTTP ${res.status}`);
  return res.json();
}
