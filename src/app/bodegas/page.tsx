import { fetchAllWarehouses } from '@/src/services/warehouseService';
import { fetchOwners } from '@/src/services/ownerService';
import { BodegasClient } from './_components/BodegasClient';
import { PageHeader } from '@/components/ui/page-header';

interface PageProps {
  searchParams: Promise<{ q?: string; ownerId?: string }>;
}

export default async function BodegasPage({ searchParams }: PageProps) {
  const { q, ownerId } = await searchParams;

  const owners = await fetchOwners().catch(() => []);
  const warehouses = await fetchAllWarehouses(owners.map((o) => o.ownerId));

  return (
    <div className="p-6 md:p-8">
      <PageHeader
        section="Almacenes"
        title="Bodegas"
        description="Gestiona los almacenes y bodegas por owner y ubicación geográfica."
      />
      <BodegasClient
        warehouses={warehouses}
        owners={owners}
        initialSearch={q ?? ''}
        initialOwnerFilter={ownerId ?? ''}
      />
    </div>
  );
}
