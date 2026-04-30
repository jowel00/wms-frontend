import { fetchAllWarehouses } from '@/src/services/warehouseService';
import { fetchLocations } from '@/src/services/locationService';
import { fetchOwners } from '@/src/services/ownerService';
import { LocationsClient } from './_components/LocationsClient';
import { PageHeader } from '@/components/ui/page-header';

interface PageProps {
  searchParams: Promise<{
    warehouseId?: string;
    aisleId?: string;
    aisleCode?: string;
    rackId?: string;
    rackCode?: string;
  }>;
}

export default async function LocationsPage({ searchParams }: PageProps) {
  const { warehouseId, aisleId, aisleCode, rackId, rackCode } = await searchParams;

  // parentLocationId determina el nivel actual:
  //   undefined → pasillos (top-level)
  //   aisleId   → racks de ese pasillo
  //   rackId    → bins de ese rack
  const parentLocationId = rackId ?? aisleId ?? undefined;

  const owners = await fetchOwners().catch(() => []);
  const warehouses = await fetchAllWarehouses(owners.map((o) => o.ownerId));

  const locations = warehouseId
    ? await fetchLocations(warehouseId, parentLocationId).catch(() => [])
    : [];

  return (
    <div className="p-6 md:p-8">
      <PageHeader
        section="Inventario"
        title="Ubicaciones"
        description="Explora y administra tus bodegas por niveles — Pasillo → Rack → Bin."
      />
      <LocationsClient
        warehouses={warehouses}
        locations={locations}
        warehouseId={warehouseId ?? ''}
        aisleId={aisleId}
        aisleCode={aisleCode}
        rackId={rackId}
        rackCode={rackCode}
      />
    </div>
  );
}
