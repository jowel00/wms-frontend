import { fetchOwners } from '@/src/services/ownerService';
import { OwnersClient } from './_components/OwnersClient';

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function OwnersPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const owners = await fetchOwners().catch(() => []);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Multi-tenancy
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Owners
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestiona los propietarios de inventario.
        </p>
      </header>
      <OwnersClient owners={owners} initialSearch={q ?? ''} />
    </div>
  );
}
