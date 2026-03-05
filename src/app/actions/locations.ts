'use server';

import { revalidatePath } from 'next/cache';
import { locationSchema } from '@/src/lib/validations/locations';
import {
  postLocation,
  patchLocation,
  patchLocationStatus,
} from '@/src/services/locationService';

type ActionResult = { success: true } | { error: string };

export async function createLocation(data: unknown): Promise<ActionResult> {
  const parsed = locationSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postLocation(parsed.data);
    revalidatePath('/ubicaciones');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear ubicación' };
  }
}

export async function updateLocation(id: string, data: unknown): Promise<ActionResult> {
  const parsed = locationSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await patchLocation(id, parsed.data);
    revalidatePath('/ubicaciones');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al actualizar ubicación' };
  }
}

export async function toggleLocationStatus(
  id: string,
  status: 'ACTIVE' | 'INACTIVE'
): Promise<ActionResult> {
  try {
    await patchLocationStatus(id, status);
    revalidatePath('/ubicaciones');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al cambiar estado' };
  }
}
