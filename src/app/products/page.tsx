import { Suspense } from 'react';
import { fetchProducts, type ProductsListResponse } from '@/src/services/productService';
import { fetchOwners } from '@/src/services/ownerService';
import { ProductsClient } from './_components/ProductsClient';
import { TableSkeleton } from '@/components/ui/table-skeleton';

// En Next.js 15+/16, searchParams es una Promesa — se consume con await
interface PageProps {
  searchParams: Promise<{ page?: string; q?: string; ownerId?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q ?? '';
  const ownerId = params.ownerId ?? '';

  const emptyProducts: ProductsListResponse = { data: [], total: 0, page: 1, totalPages: 1 };

  // Ambas peticiones en paralelo para reducir el tiempo de espera total
  const [productsData, owners] = await Promise.all([
    fetchProducts({
      page,
      limit: 10,
      q: q || undefined,
      ownerId: ownerId || undefined,
    }).catch(() => emptyProducts),
    fetchOwners().catch(() => []),
  ]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Inventario
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          Productos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {ownerId
            ? `${productsData.total.toLocaleString('es-CO')} productos registrados`
            : 'Selecciona un owner para ver sus productos'}
        </p>
      </div>

      {/* Suspense necesario porque ProductsClient usa useSearchParams internamente */}
      <Suspense fallback={<TableSkeleton columns={5} />}>
        <ProductsClient
          products={productsData.data}
          owners={owners}
          total={productsData.total}
          currentPage={productsData.page}
          totalPages={productsData.totalPages}
          initialSearch={q}
          initialOwnerFilter={ownerId}
        />
      </Suspense>
    </div>
  );
}
