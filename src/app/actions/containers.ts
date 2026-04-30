'use server';

import { revalidatePath } from 'next/cache';
import { containerSchema } from '@/src/lib/validations/containers';
import { postContainer, closeContainer } from '@/src/services/containerService';
import type { ActionResult } from '@/src/types/actions';

export async function createContainer(data: unknown): Promise<ActionResult> {
  const parsed = containerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postContainer(parsed.data);
    revalidatePath('/containers');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear contenedor' };
  }
}

export async function closeContainerAction(id: string): Promise<ActionResult> {
  try {
    await closeContainer(id);
    revalidatePath('/containers');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al cerrar contenedor' };
  }
}
