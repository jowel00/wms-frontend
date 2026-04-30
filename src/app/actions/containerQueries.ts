'use server';

import { fetchLocations, fetchAllLocations } from '@/src/services/locationService';
import { fetchContainers } from '@/src/services/containerService';
import type { InventoryContainer, Location } from '@/src/types/inventory';

export async function queryContainersLocations(
  warehouseId: string,
  parentLocationId?: string
): Promise<Location[]> {
  return fetchLocations(warehouseId, parentLocationId).catch(() => []);
}

export async function queryAllContainersLocations(warehouseId: string): Promise<Location[]> {
  return fetchAllLocations(warehouseId).catch(() => []);
}

export async function queryContainers(warehouseId: string): Promise<InventoryContainer[]> {
  return fetchContainers(warehouseId).catch(() => []);
}
