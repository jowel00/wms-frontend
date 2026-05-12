import type { InventoryContainer, ContainerDetail } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // Si hay details[], usar el primer mensaje de campo específico en lugar del genérico
    const detail = body?.details?.[0]?.message;
    throw new Error(detail ?? body?.message ?? `HTTP ${res.status}`);
  }
}

// GET /api/v1/inventory/containers?ownerId=|warehouseId=|locationId=|status=
export async function fetchContainers(
  filter: { ownerId?: string; warehouseId?: string; locationId?: string; status?: string }
): Promise<InventoryContainer[]> {
  const params = new URLSearchParams();
  if (filter.ownerId)     params.set('ownerId',     filter.ownerId);
  if (filter.warehouseId) params.set('warehouseId', filter.warehouseId);
  if (filter.locationId)  params.set('locationId',  filter.locationId);
  if (filter.status)      params.set('status',      filter.status);

  const res = await fetch(`${apiUrl()}/inventory/containers?${params}`, {
    cache: 'no-store',
  });
  await throwIfError(res);
  return res.json();
}

// GET /api/v1/inventory/containers/:containerId → ContainerDetailResponse
export async function fetchContainerById(containerId: string): Promise<ContainerDetail> {
  const res = await fetch(`${apiUrl()}/inventory/containers/${containerId}`, {
    cache: 'no-store',
  });
  await throwIfError(res);
  return res.json();
}

// POST /api/v1/inventory/receive
// Crea el contenedor en estado CREATED + primera línea de producto en un solo call
export async function receiveContainer(data: {
  ownerId: string;
  warehouseId: string;
  typeId: string;
  productId: string;
  quantity: number;
  lot?: { lotId: string } | { batchCode: string; expiresAt: string; receivedAt: string };
}): Promise<{ containerId: string; status: 'CREATED' }> {
  const res = await fetch(`${apiUrl()}/inventory/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

// POST /api/v1/inventory/containers/:containerId/putaway
// Asigna ubicación a un contenedor CREATED → lo transiciona a ACTIVE
export async function putawayContainer(
  containerId: string,
  locationId: string
): Promise<{ containerId: string; status: 'ACTIVE'; locationId: string }> {
  const res = await fetch(`${apiUrl()}/inventory/containers/${containerId}/putaway`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ locationId }),
  });
  await throwIfError(res);
  return res.json();
}

// POST /api/v1/inventory/containers/:containerId/move
// Mueve un contenedor activo a otra ubicación
export async function moveContainer(
  containerId: string,
  toLocationId: string
): Promise<void> {
  const res = await fetch(`${apiUrl()}/inventory/containers/${containerId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toLocationId }),
  });
  await throwIfError(res);
}
