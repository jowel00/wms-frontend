import { fetchOwners } from '@/src/services/ownerService';
import { fetchWarehouses } from '@/src/services/warehouseService';
import { fetchAllLocations } from '@/src/services/locationService';
import { fetchContainers } from '@/src/services/containerService';
import { ContainersClient } from './_components/ContainersClient';

interface PageProps {
  searchParams: Promise<{
    ownerId?: string;
    warehouseId?: string;
    locationId?: string;
  }>;
}

export default async function ContenedoresPage({ searchParams }: PageProps) {
  const { ownerId, warehouseId, locationId } = await searchParams;

  const owners = await fetchOwners().catch(() => []);
  const warehousesByOwner = await Promise.all(
    owners.map((o) => fetchWarehouses(o.ownerId).catch(() => []))
  );
  const warehouses = warehousesByOwner.flat();

  const [locations, containers] = await Promise.all([
    warehouseId ? fetchAllLocations(warehouseId).catch(() => []) : Promise.resolve([]),
    warehouseId ? fetchContainers(warehouseId).catch(() => []) : Promise.resolve([]),
  ]);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Inventario
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Contenedores
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestiona los contenedores de inventario (pallets, cajas, canastas) por bodega.
        </p>
      </header>
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
