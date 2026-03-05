import { fetchWarehouses } from '@/src/services/warehouseService';
import { fetchLocations } from '@/src/services/locationService';
import { UbicacionesClient } from './_components/UbicacionesClient';

interface PageProps {
  searchParams: Promise<{ q?: string; warehouseId?: string }>;
}

export default async function UbicacionesPage({ searchParams }: PageProps) {
  const { q, warehouseId } = await searchParams;

  const [warehouses, locations] = await Promise.all([
    fetchWarehouses().catch(() => []),
    warehouseId ? fetchLocations(warehouseId).catch(() => []) : Promise.resolve([]),
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
          Gestiona las ubicaciones dentro de cada bodega — Pasillo → Rack → Bin.
        </p>
      </header>
      <UbicacionesClient
        warehouses={warehouses}
        locations={locations}
        initialSearch={q ?? ''}
        initialWarehouseId={warehouseId ?? ''}
      />
    </div>
  );
}
