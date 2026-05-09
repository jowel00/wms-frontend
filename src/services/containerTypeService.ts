import type { ContainerTypeItem } from '@/src/types/inventory';
import { apiUrl } from '@/src/services/api';

async function throwIfError(res: Response): Promise<void> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
}

export async function fetchContainerTypes(): Promise<ContainerTypeItem[]> {
  const res = await fetch(`${apiUrl()}/container-types`, { cache: 'no-store' });
  await throwIfError(res);
  return res.json();
}
