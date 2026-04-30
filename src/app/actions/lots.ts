'use server';

import { revalidatePath } from 'next/cache';
import { lotSchema } from '@/src/lib/validations/lots';
import { postLot } from '@/src/services/lotService';
import { fetchProducts } from '@/src/services/productService';
import type { ProductListItem } from '@/src/types/inventory';
import type { ActionResult } from '@/src/types/actions';

export async function createLot(data: unknown): Promise<ActionResult> {
  const parsed = lotSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const { ownerId, productId, batchCode, expiresAt, receivedAt } = parsed.data;
    await postLot({
      ownerId,
      productId,
      batchCode,
      expiresAt: expiresAt || undefined,
      receivedAt: receivedAt || undefined,
    });
    revalidatePath('/lots');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear lote' };
  }
}

// Carga productos de un owner para el selector del dialog
export async function queryLotProducts(ownerId: string): Promise<ProductListItem[]> {
  const result = await fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null);
  return result?.data ?? [];
}
