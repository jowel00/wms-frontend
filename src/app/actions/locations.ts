'use server';

import { revalidatePath } from 'next/cache';
import { locationSchema } from '@/src/lib/validations/locations';
import { postLocation, deactivateLocation, fetchLocations, fetchLocationTypes } from '@/src/services/locationService';
import type { Location, LocationTypeItem } from '@/src/types/inventory';
import type { ActionResult } from '@/src/types/actions';

export async function createLocation(data: unknown): Promise<ActionResult> {
  const parsed = locationSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postLocation({
      warehouseId: parsed.data.warehouseId,
      typeId: parsed.data.typeId,
      parentLocationId: parsed.data.parentLocationId,
    });
    revalidatePath('/ubicaciones');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear ubicación' };
  }
}

// El backend solo expone PATCH /locations/{id}/deactivate — no hay endpoint de edición genérico
export async function updateLocation(id: string, _data: unknown): Promise<ActionResult> {
  try {
    await deactivateLocation(id);
    revalidatePath('/ubicaciones');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al desactivar ubicación' };
  }
}

// Usado desde el dialog en el cliente para cargar opciones de la jerarquía
export async function queryLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  return fetchLocations(warehouseId, parentLocationId).catch(() => []);
}

// Carga los tipos de ubicación disponibles desde el backend
export async function queryLocationTypes(): Promise<LocationTypeItem[]> {
  return fetchLocationTypes().catch(() => []);
}
