'use server';

import { revalidatePath } from 'next/cache';
import { containerLineSchema } from '@/src/lib/validations/containerLines';
import { postContainerLine } from '@/src/services/containerLineService';
import { fetchProducts } from '@/src/services/productService';
import { fetchLots } from '@/src/services/lotService';
import type { ProductListItem, Lot } from '@/src/types/inventory';
import type { ActionResult } from '@/src/types/actions';

export async function createContainerLine(
  containerId: string,
  data: unknown
): Promise<ActionResult> {
  const parsed = containerLineSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postContainerLine(containerId, {
      productId: parsed.data.productId,
      lotId: parsed.data.lotId,
      qtyTotal: parsed.data.qtyTotal,
    });
    revalidatePath(`/contenedores/${containerId}`);
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al agregar línea' };
  }
}

export async function queryLineProducts(ownerId: string): Promise<ProductListItem[]> {
  const result = await fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null);
  return result?.data ?? [];
}

export async function queryLineLots(ownerId: string): Promise<Lot[]> {
  const all = await fetchLots().catch(() => []);
  return all.filter((l) => l.ownerId === ownerId);
}
