import type { InventoryContainer } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

// GET /api/v1/inventory-containers?warehouseId=UUID
export async function fetchContainers(warehouseId: string): Promise<InventoryContainer[]> {
  const res = await fetch(`${apiUrl()}/inventory-containers?warehouseId=${warehouseId}`, {
    cache: 'no-store',
  });
  await throwIfError(res);
  return res.json();
}

// POST /api/v1/inventory-containers
export async function postContainer(data: {
  ownerId: string;
  warehouseId: string;
  locationId: string;
  type: string;
}): Promise<InventoryContainer> {
  const res = await fetch(`${apiUrl()}/inventory-containers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await throwIfError(res);
  return res.json();
}

// GET /api/v1/inventory-containers/{containerId}
export async function fetchContainerById(containerId: string): Promise<InventoryContainer> {
  const res = await fetch(`${apiUrl()}/inventory-containers/${containerId}`, {
    cache: 'no-store',
  });
  await throwIfError(res);
  return res.json();
}

// PATCH /api/v1/inventory-containers/{id}/close — cierra el contenedor
export async function closeContainer(id: string): Promise<void> {
  const res = await fetch(`${apiUrl()}/inventory-containers/${id}/close`, {
    method: 'PATCH',
  });
  await throwIfError(res);
}
