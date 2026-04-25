import type { InventoryContainer } from '@/src/types/inventory';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// GET /api/v1/inventory-containers?warehouseId=UUID
export async function fetchContainers(warehouseId: string): Promise<InventoryContainer[]> {
  const res = await fetch(`${apiUrl()}/inventory-containers?warehouseId=${warehouseId}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`fetchContainers: HTTP ${res.status}`);
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
  if (!res.ok) throw new Error(`postContainer: HTTP ${res.status}`);
  return res.json();
}

// GET /api/v1/inventory-containers/{containerId}
export async function fetchContainerById(containerId: string): Promise<InventoryContainer> {
  const res = await fetch(`${apiUrl()}/inventory-containers/${containerId}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`fetchContainerById: HTTP ${res.status}`);
  return res.json();
}

// PATCH /api/v1/inventory-containers/{id}/close — cierra el contenedor
export async function closeContainer(id: string): Promise<void> {
  const res = await fetch(`${apiUrl()}/inventory-containers/${id}/close`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error(`closeContainer: HTTP ${res.status}`);
}
