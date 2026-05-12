import type { ContainerLine } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

// GET /api/v1/inventory/containers/{containerId}/lines
export async function fetchContainerLines(containerId: string): Promise<ContainerLine[]> {
  const res = await fetch(
    `${apiUrl()}/inventory/containers/${containerId}/lines`,
    { cache: 'no-store' }
  );
  await throwIfError(res);
  return res.json();
}

