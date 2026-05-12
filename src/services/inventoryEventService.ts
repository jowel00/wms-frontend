import type { InventoryEvent } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.details?.[0]?.message;
    throw new Error(detail ?? body?.message ?? `HTTP ${res.status}`);
  }
}

// GET /api/v1/inventory/events?containerId=
export async function fetchInventoryEvents(containerId: string): Promise<InventoryEvent[]> {
  const res = await fetch(`${apiUrl()}/inventory/events?containerId=${containerId}`, {
    cache: 'no-store',
  });
  await throwIfError(res);
  return res.json();
}
