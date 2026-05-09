'use server';

import { revalidatePath } from 'next/cache';
import { receiveSchema, putawaySchema, moveSchema } from '@/src/lib/validations/containers';
import {
  receiveContainer,
  putawayContainer,
  moveContainer,
} from '@/src/services/containerService';
import { fetchContainerTypes } from '@/src/services/containerTypeService';
import { fetchProducts } from '@/src/services/productService';
import type { ContainerTypeItem, ProductListItem } from '@/src/types/inventory';
import type { ActionResult } from '@/src/types/actions';

export async function queryContainerTypes(): Promise<ContainerTypeItem[]> {
  return fetchContainerTypes().catch(() => []);
}

export async function queryLineProducts(ownerId: string): Promise<ProductListItem[]> {
  const result = await fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null);
  return result?.data ?? [];
}

export async function receiveContainerAction(
  data: unknown
): Promise<ActionResult<{ containerId: string; status: 'CREATED' }>> {
  const parsed = receiveSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const result = await receiveContainer(parsed.data);
    revalidatePath('/containers');
    return { success: true, data: result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al recibir contenedor' };
  }
}

export async function putawayContainerAction(
  containerId: string,
  data: unknown
): Promise<ActionResult<{ containerId: string; status: 'ACTIVE'; locationId: string }>> {
  const parsed = putawaySchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const result = await putawayContainer(containerId, parsed.data.locationId);
    revalidatePath('/containers');
    return { success: true, data: result };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al ubicar contenedor' };
  }
}

export async function moveContainerAction(
  containerId: string,
  data: unknown
): Promise<ActionResult> {
  const parsed = moveSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await moveContainer(containerId, parsed.data.toLocationId);
    revalidatePath('/containers');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al mover contenedor' };
  }
}
