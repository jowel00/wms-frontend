'use server';

import { revalidatePath } from 'next/cache';
import { locationSchema } from '@/src/lib/validations/locations';
import { postLocation, patchLocation, fetchLocations } from '@/src/services/locationService';
import type { Location } from '@/src/types/inventory';

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

// Usado desde el dialog en el cliente para cargar opciones de la jerarquía
export async function queryLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  return fetchLocations(warehouseId, parentLocationId).catch(() => []);
}
