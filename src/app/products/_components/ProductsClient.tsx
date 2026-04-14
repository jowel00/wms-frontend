'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Package, Plus, AlertCircle, Building2, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { Paginator } from '@/components/ui/paginator';
import { SearchInput } from '@/components/ui/search-input';
import { ProductOwnerFilter } from './ProductOwnerFilter';
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
  const [, startActionTransition] = useTransition();

  const [optimisticProducts, dispatchOptimistic] = useOptimistic(
    products,
    (state: ProductListItem[], newProduct: ProductListItem) => [...state, newProduct]
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const rangeStart = (currentPage - 1) * 10 + 1;
  const rangeEnd = Math.min(currentPage * 10, total);

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

  // ── Pantalla de selección de owner ────────────────────────────────────────
  if (!initialOwnerFilter) {
    return <OwnerGate owners={owners} />;
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Buscador debounced + filtro de owner + botón crear */}
      <div className="flex items-center gap-3 flex-wrap">
        <Suspense>
          <SearchInput
            placeholder="Buscar por SKU o nombre..."
            initialValue={initialSearch}
            className="flex-1"
            filters={
              <ProductOwnerFilter owners={owners} initialValue={initialOwnerFilter} />
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

// ── Pantalla gate: obliga a elegir un owner antes de ver productos ────────────

function OwnerGate({ owners }: { owners: Owner[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');
  const filtered = search.trim()
    ? activeOwners.filter((o) =>
        o.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : activeOwners;

  function selectOwner(ownerId: string) {
    router.push(`${pathname}?ownerId=${ownerId}&page=1`);
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icono + titular */}
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
        <Building2 className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-black text-foreground uppercase tracking-wide text-center">
        Selecciona un owner
      </h2>
      <p className="text-base text-muted-foreground mt-2 mb-8 text-center max-w-md">
        Los productos están organizados por owner. Elige uno para ver y gestionar su catálogo.
      </p>

      {/* Buscador de owners */}
      {activeOwners.length > 0 && (
        <div className="relative w-full max-w-3xl mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar owner..."
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-border bg-background text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}

      {/* Grid de tarjetas */}
      {activeOwners.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay owners activos registrados.</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No se encontró ningún owner con ese nombre.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
          {filtered.map((owner) => (
            <li key={owner.ownerId}>
              <button
                type="button"
                onClick={() => selectOwner(owner.ownerId)}
                className="group w-full flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-card px-5 py-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0 transition-colors group-hover:bg-primary/20">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug break-words whitespace-normal">
                    {owner.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
