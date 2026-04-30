import { fetchOwners } from '@/src/services/ownerService';
import { OwnersClient } from './_components/OwnersClient';
import { PageHeader } from '@/components/ui/page-header';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function OwnersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const owners = await fetchOwners().catch(() => []);

  return (
    <div className="p-6 md:p-8">
      <PageHeader
        section="Multi-tenancy"
        title="Owners"
        description="Gestiona los propietarios de inventario."
      />
      <OwnersClient owners={owners} initialSearch={q ?? ''} />
    </div>
  );
}
