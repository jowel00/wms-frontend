'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { Layers, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { OwnerGate } from '@/components/ui/owner-gate';
import { OwnerSelect } from '@/components/ui/owner-select';
import { buildParams } from '@/src/lib/url';
import { LotsTable } from './LotsTable';
import { createLot } from '@/src/app/actions/lots';
import type { Owner, Lot, ProductListItem } from '@/src/types/inventory';
import type { LotFormValues } from '@/src/lib/validations/lots';

const LotDialog = dynamic(
  () => import('./LotDialog').then((m) => m.LotDialog),
  { loading: () => null }
);

interface LotsClientProps {
  owners: Owner[];
  lots: Lot[];
  products: ProductListItem[];
  ownerId: string;
}

function LotsClientInner({ owners, lots, products, ownerId }: LotsClientProps) {
  const { push } = useRouter();
  const pathname  = usePathname();
  const [, startActionTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);

  const [optimisticLots, dispatchOptimistic] = useOptimistic(
    lots,
    (state: Lot[], newLot: Lot) => [newLot, ...state]
  );

  function pushParams(params: Record<string, string | undefined>) {
    push(`${pathname}?${buildParams(params)}`);
  }

  function handleCreate(data: LotFormValues) {
    const temp: Lot = {
      lotId: `opt-${Date.now()}`,
      ownerId: data.ownerId,
      productId: data.productId,
      supplierId: null,
      batchCode: data.batchCode,
      expiresAt: data.expiresAt ?? null,
      receivedAt: data.receivedAt ?? null,
    };

    startActionTransition(async () => {
      dispatchOptimistic(temp);
      const result = await createLot(data);
      if ('error' in result) {
        toast.error(result.error);
      } else {
        const product = products.find((p) => p.productId === data.productId);
        toast.success(`Lote ${data.batchCode} creado — ${product?.name ?? 'Producto'}`);
      }
    });
  }

  if (!ownerId) {
    return (
      <OwnerGate
        owners={owners}
        title="Selecciona un owner"
        description="Los lotes están organizados por owner. Elige uno para ver y gestionar sus lotes de inventario."
      />
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <OwnerSelect
          owners={owners}
          value={ownerId}
          onChange={(id) => pushParams({ ownerId: id || undefined })}
          className="w-56"
        />
        <span className="text-xs text-muted-foreground">
          {optimisticLots.length} {optimisticLots.length === 1 ? 'lote' : 'lotes'}
        </span>
        <Button
          onClick={() => setDialogOpen(true)}
          className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Nuevo lote
        </Button>
      </div>

      {optimisticLots.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="Sin lotes registrados"
          description="Este owner aún no tiene lotes. Crea el primero para comenzar."
          action={{ label: '+ Crear el primero', onClick: () => setDialogOpen(true) }}
        />
      ) : (
        <LotsTable lots={optimisticLots} products={products} />
      )}

      <LotDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        owners={owners}
        defaultOwnerId={ownerId}
        onSubmit={handleCreate}
      />
    </>
  );
}

export function LotsClient(props: LotsClientProps) {
  return (
    <Suspense>
      <LotsClientInner {...props} />
    </Suspense>
  );
}
