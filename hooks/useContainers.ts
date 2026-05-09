import type { InventoryContainer, Location } from '@/src/types/inventory';

export function useContainers(
  containers: InventoryContainer[],
  locations: Location[],
  status: string,
  locationId: string
) {
  // BINs activos con etiqueta de path jerárquico: PA-001 › RK-001 › BIN-001
  const locationMap = new Map(locations.map((l) => [l.locationId, l]));
  const binOptions = locations
    .filter((l) => l.type === 'BIN' && l.active)
    .map((bin) => {
      const rack  = bin.parentLocationId ? locationMap.get(bin.parentLocationId) : undefined;
      const aisle = rack?.parentLocationId ? locationMap.get(rack.parentLocationId) : undefined;
      const path  = [aisle?.code, rack?.code, bin.code].filter(Boolean).join(' › ');
      return { locationId: bin.locationId, label: path || bin.code };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  // Filtrado de contenedores — el servidor ya filtra; esto cubre actualizaciones optimistas
  const visible = containers.filter((c) => {
    if (status     && c.status     !== status)     return false;
    if (locationId && c.locationId !== locationId) return false;
    return true;
  });

  return { binOptions, visible };
}
