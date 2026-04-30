'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Package, Plus } from 'lucide-react';
import { OwnerGate } from './OwnerGate';
import { Button } from '@/components/ui/button';
import { ActionError } from '@/components/ui/action-error';
import { OwnerSelect } from '@/components/ui/owner-select';
import { DataTable, type Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Paginator } from '@/components/ui/paginator';
import { SearchInput } from '@/components/ui/search-input';
import { createProductAction } from '@/src/app/actions/products';
import type { ProductListItem, Owner } from '@/src/types/inventory';
import type { ProductFormValues } from '@/src/lib/validations/products';

const ProductDialog = dynamic(
  () => import('./ProductDialog').then((m) => m.ProductDialog),
  { loading: () => null }
);

interface ProductsClientProps {
  products: ProductListItem[];
  owners: Owner[];
  total: number;
  currentPage: number;
  totalPages: number;
  initialSearch: string;
  initialOwnerFilter: string;
}

const columns: Column<ProductListItem>[] = [
  {
    key: 'sellerSku',
    header: 'SKU / Código',
    cell: (row) => <span className="font-mono">{row.sellerSku}</span>,
  },
  {
    key: 'name',
    header: 'Nombre',
    cell: (row) => row.name,
  },
  {
    key: 'barcodeUpcEan',
    header: 'Código de barras',
    cell: (row) =>
      row.barcodeUpcEan ? (
        <span className="font-mono">{row.barcodeUpcEan}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: 'requiresUnitTracking',
    header: 'Trazabilidad',
    cell: (row) => (row.requiresUnitTracking ? 'Sí' : 'No'),
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    key: 'hasExpiration',
    header: 'Vencimiento',
    cell: (row) => (row.hasExpiration ? 'Sí' : 'No'),
    className: 'text-center',
    headerClassName: 'text-center',
  },
];

export function ProductsClient({
  products,
  owners,
  total,
  currentPage,
  totalPages,
  initialSearch,
  initialOwnerFilter,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startActionTransition] = useTransition();

  const [optimisticProducts, dispatchOptimistic] = useOptimistic(
    products,
    (state: ProductListItem[], newProduct: ProductListItem) => [...state, newProduct]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rangeStart = (currentPage - 1) * 10 + 1;
  const rangeEnd = Math.min(currentPage * 10, total);

  function handleOwnerFilter(val: string) {
    const params = new URLSearchParams(window.location.search);
    if (val) {
      params.set('ownerId', val);
    } else {
      params.delete('ownerId');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSubmit(data: ProductFormValues) {
    setActionError(null);

    const temp: ProductListItem = {
      productId: `opt-${Date.now()}`,
      sellerSku: data.sellerSku,
      name: data.name,
      barcodeUpcEan: data.barcodeUpcEan || undefined,
      requiresUnitTracking: data.requiresUnitTracking,
      hasExpiration: data.hasExpiration,
    };

    startActionTransition(async () => {
      dispatchOptimistic(temp);
      const result = await createProductAction(data);
      if ('error' in result) setActionError(result.error);
    });
  }

  if (!initialOwnerFilter) return <OwnerGate owners={owners} />;

  return (
    <div className="space-y-4">
      <ActionError message={actionError} />

      {/* Buscador debounced + filtro de owner + botón crear */}
      <div className="flex items-center gap-3 flex-wrap">
        <Suspense>
          <SearchInput
            placeholder="Buscar por SKU o nombre..."
            initialValue={initialSearch}
            className="flex-1"
            filters={
              <OwnerSelect owners={owners} value={initialOwnerFilter} onChange={handleOwnerFilter} className="h-14 w-full sm:w-56" />
            }
          />
        </Suspense>
        <Button
          onClick={() => {
            setActionError(null);
            setDialogOpen(true);
          }}
          className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Nuevo producto
        </Button>
      </div>

      {/* Barra superior: conteo de resultados + paginador compacto */}
      <div className="flex items-center justify-between min-h-10">
        <p className="text-sm text-muted-foreground">
          {total > 0
            ? `Mostrando ${rangeStart}–${rangeEnd} de ${total.toLocaleString('es-CO')}`
            : 'Sin resultados'}
        </p>
        <Suspense>
          <Paginator currentPage={currentPage} totalPages={totalPages} variant="compact" />
        </Suspense>
      </div>

      {/* Tabla de resultados */}
      {optimisticProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No se encontraron productos"
          description="Intenta cambiar los filtros o el término de búsqueda."
          action={
            !initialSearch && !initialOwnerFilter
              ? { label: '+ Agregar el primero', onClick: () => setDialogOpen(true) }
              : undefined
          }
        />
      ) : (
        <DataTable
          data={optimisticProducts}
          columns={columns}
          keyExtractor={(row) => row.productId}
          isOptimistic={(row) => row.productId.startsWith('opt-')}
        />
      )}

      {/* Paginador inferior completo */}
      {optimisticProducts.length > 0 && (
        <div className="flex justify-center pt-4">
          <Suspense>
            <Paginator currentPage={currentPage} totalPages={totalPages} variant="full" />
          </Suspense>
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        owners={owners}
        onSubmit={handleSubmit}
        lockedOwnerId={initialOwnerFilter || undefined}
        lockedOwnerName={owners.find((o) => o.ownerId === initialOwnerFilter)?.name}
      />
    </div>
  );
}

