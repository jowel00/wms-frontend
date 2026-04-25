import type { ContainerLine } from '@/src/types/inventory';

function apiUrl() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_URL no está configurada.');
  return base;
}

// GET /api/v1/inventory-containers/{containerId}/lines
export async function fetchContainerLines(containerId: string): Promise<ContainerLine[]> {
  const res = await fetch(
    `${apiUrl()}/inventory-containers/${containerId}/lines`,
    { cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`fetchContainerLines: HTTP ${res.status}`);
  return res.json();
}

// POST /api/v1/inventory-containers/{containerId}/lines
export async function postContainerLine(
  containerId: string,
  data: { productId: string; lotId?: string; qtyTotal: number }
): Promise<ContainerLine> {
  const res = await fetch(
    `${apiUrl()}/inventory-containers/${containerId}/lines`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error(`postContainerLine: HTTP ${res.status}`);
  return res.json();
}
