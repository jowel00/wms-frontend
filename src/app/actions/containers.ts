'use server';

import { revalidatePath } from 'next/cache';
import { containerSchema } from '@/src/lib/validations/containers';
import { postContainer, closeContainer, fetchContainers } from '@/src/services/containerService';
import { fetchLocations } from '@/src/services/locationService';
import type { InventoryContainer } from '@/src/types/inventory';
import type { Location } from '@/src/types/inventory';

type ActionResult = { success: true } | { error: string };

export async function createContainer(data: unknown): Promise<ActionResult> {
  const parsed = containerSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  try {
    await postContainer(parsed.data);
    revalidatePath('/contenedores');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al crear contenedor' };
  }
}

export async function closeContainerAction(id: string): Promise<ActionResult> {
  try {
    await closeContainer(id);
    revalidatePath('/contenedores');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error al cerrar contenedor' };
  }
}

// Usado desde el dialog para cargar cada nivel de la jerarquía (Pasillo → Rack → Bin)
// parentLocationId === undefined → pasillos (top-level)
// parentLocationId === aisleId  → racks de ese pasillo
// parentLocationId === rackId   → bins de ese rack
export async function queryContainersLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  return fetchLocations(warehouseId, parentLocationId).catch(() => []);
}

// Trae todas las locations de una bodega en una sola llamada (para el dialog de creación)
export async function queryAllContainersLocations(warehouseId: string): Promise<Location[]> {
  const { fetchAllLocations } = await import('@/src/services/locationService');
  return fetchAllLocations(warehouseId).catch(() => []);
}

export async function queryContainers(warehouseId: string): Promise<InventoryContainer[]> {
  return fetchContainers(warehouseId).catch(() => []);
}
