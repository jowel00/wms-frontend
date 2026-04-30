'use server';

import { revalidatePath } from 'next/cache';
import { warehouseSchema } from '@/src/lib/validations/warehouses';
import {
  postWarehouse,
  patchWarehouse,
  patchWarehouseStatus,
} from '@/src/services/warehouseService';
import type { ActionResult } from '@/src/types/actions';

export async function createWarehouse(data: unknown): Promise<ActionResult> {
  const parsed = warehouseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postWarehouse(parsed.data);
    revalidatePath('/warehouses');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear bodega' };
  }
}

export async function updateWarehouse(id: string, data: unknown): Promise<ActionResult> {
  const parsed = warehouseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await patchWarehouse(id, parsed.data);
    revalidatePath('/warehouses');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al actualizar bodega' };
  }
}

export async function toggleWarehouseStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<ActionResult> {
  try {
    await patchWarehouseStatus(id, status);
    revalidatePath('/warehouses');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al cambiar estado' };
  }
}
