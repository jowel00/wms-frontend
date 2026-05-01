'use server';

import { revalidatePath } from 'next/cache';
import { ownerSchema } from '@/src/lib/validations/owners';
import { postOwner, patchOwner, patchOwnerStatus } from '@/src/services/ownerService';
import type { Owner } from '@/src/types/inventory';
import type { ActionResult } from '@/src/types/actions';

export async function createOwner(data: unknown): Promise<ActionResult<Owner>> {
  const parsed = ownerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const owner = await postOwner(parsed.data);
    revalidatePath('/owners');
    return { success: true, data: owner };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear owner' };
  }
}

export async function updateOwner(id: string, data: unknown): Promise<ActionResult<Owner>> {
  const parsed = ownerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    const owner = await patchOwner(id, parsed.data);
    revalidatePath('/owners');
    return { success: true, data: owner };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al actualizar owner' };
  }
}

export async function toggleOwnerStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<ActionResult> {
  try {
    await patchOwnerStatus(id, status);
    revalidatePath('/owners');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al cambiar estado' };
  }
}
