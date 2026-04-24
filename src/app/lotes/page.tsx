import { fetchOwners } from '@/src/services/ownerService';
import { fetchLots } from '@/src/services/lotService';
import { fetchProducts } from '@/src/services/productService';
import { LotsClient } from './_components/LotsClient';

interface PageProps {
  searchParams: Promise<{ ownerId?: string }>;
}

export default async function LotesPage({ searchParams }: PageProps) {
  const { ownerId } = await searchParams;

  const owners = await fetchOwners().catch(() => []);

  const [allLots, productsData] = await Promise.all([
    fetchLots().catch(() => []),
    ownerId
      ? fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const lots = ownerId ? allLots.filter((l) => l.ownerId === ownerId) : [];
  const products = productsData?.data ?? [];

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Inventario
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Lotes
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Gestiona los lotes de productos con trazabilidad de vencimiento y recepción.
        </p>
      </header>

      <LotsClient
        owners={owners}
        lots={lots}
        products={products}
        ownerId={ownerId ?? ''}
      />
    </div>
  );
}
