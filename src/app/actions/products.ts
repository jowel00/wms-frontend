'use server';

import { revalidatePath } from 'next/cache';
import { productSchema } from '@/src/lib/validations/products';
import { createProduct } from '@/src/services/productService';
import type { ActionResult } from '@/src/types/actions';

export async function createProductAction(data: unknown): Promise<ActionResult> {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { barcodeUpcEan, ...rest } = parsed.data;

  try {
    await createProduct({
      ...rest,
      barcodeUpcEan: barcodeUpcEan || undefined,
    });
    revalidatePath('/products');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear producto' };
  }
}
