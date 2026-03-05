import { fetchWarehouses } from '@/src/services/warehouseService';
import { fetchOwners } from '@/src/services/ownerService';
import { BodegasClient } from './_components/BodegasClient';

interface PageProps {
  searchParams: Promise<{ q?: string; ownerId?: string }>;
}

export default async function BodegasPage({ searchParams }: PageProps) {
  const { q, ownerId } = await searchParams;
  const [warehouses, owners] = await Promise.all([
    fetchWarehouses().catch(() => []),
    fetchOwners().catch(() => []),
  ]);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Almacenes
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Bodegas
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestiona los almacenes y bodegas por owner y ubicación geográfica.
        </p>
      </header>
      <BodegasClient
        warehouses={warehouses}
        owners={owners}
        initialSearch={q ?? ''}
        initialOwnerFilter={ownerId ?? ''}
      />
    </div>
  );
}
