import { fetchWarehouses } from '@/src/services/warehouseService';
import { fetchLocations } from '@/src/services/locationService';
import { UbicacionesClient } from './_components/UbicacionesClient';

interface PageProps {
  searchParams: Promise<{
    warehouseId?: string;
    aisleId?: string;
    aisleCode?: string;
    rackId?: string;
    rackCode?: string;
  }>;
}

export default async function UbicacionesPage({ searchParams }: PageProps) {
  const { warehouseId, aisleId, aisleCode, rackId, rackCode } = await searchParams;

  // parentLocationId determina el nivel actual:
  //   undefined → pasillos (top-level)
  //   aisleId   → racks de ese pasillo
  //   rackId    → bins de ese rack
  const parentLocationId = rackId ?? aisleId ?? undefined;

  const [warehouses, locations] = await Promise.all([
    fetchWarehouses().catch(() => []),
    warehouseId
      ? fetchLocations(warehouseId, parentLocationId).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Inventario
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Ubicaciones
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
        Explora y administra tus bodegas por niveles — Pasillo → Rack → Bin.
        </p>
      </header>
      <UbicacionesClient
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
