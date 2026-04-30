import { fetchOwners } from '@/src/services/ownerService';
import { fetchAllWarehouses } from '@/src/services/warehouseService';
import { fetchAllLocations } from '@/src/services/locationService';
import { fetchContainers } from '@/src/services/containerService';
import { ContainersClient } from './_components/ContainersClient';
import { PageHeader } from '@/components/ui/page-header';

interface PageProps {
  searchParams: Promise<{
    ownerId?: string;
    warehouseId?: string;
    locationId?: string;
  }>;
}

export default async function ContainersPage({ searchParams }: PageProps) {
  const { ownerId, warehouseId, locationId } = await searchParams;

  const owners = await fetchOwners().catch(() => []);
  const warehouses = await fetchAllWarehouses(owners.map((o) => o.ownerId));

  const [locations, containers] = await Promise.all([
    warehouseId ? fetchAllLocations(warehouseId).catch(() => []) : Promise.resolve([]),
    warehouseId ? fetchContainers(warehouseId).catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <div className="p-6 md:p-8">
      <PageHeader
        section="Inventario"
        title="Contenedores"
        description="Gestiona los contenedores de inventario (pallets, cajas, canastas) por bodega."
      />
      <ContainersClient
        owners={owners}
        warehouses={warehouses}
        locations={locations}
        containers={containers}
        ownerId={ownerId ?? ''}
        warehouseId={warehouseId ?? ''}
        locationId={locationId ?? ''}
      />
    </div>
  );
}
