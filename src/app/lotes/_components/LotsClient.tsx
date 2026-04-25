'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { Layers, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
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
  const router = useRouter();
  const pathname = usePathname();
  const [, startActionTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [optimisticLots, dispatchOptimistic] = useOptimistic(
    lots,
    (state: Lot[], newLot: Lot) => [newLot, ...state]
  );

  function pushParams(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); });
    router.push(`${pathname}?${p.toString()}`);
  }

  function handleOwnerChange(id: string) {
    pushParams({ ownerId: id });
  }

  function handleCreate(data: LotFormValues) {
    setActionError(null);

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
      if ('error' in result) setActionError(result.error);
    });
  }

  const selectedOwner = owners.find((o) => o.ownerId === ownerId);

  return (
    <>
      {/* Selector de owner */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Owner
          </label>
          <Select value={ownerId || undefined} onValueChange={handleOwnerChange}>
            <SelectTrigger
              className={cn(
                'w-64 h-16 text-base font-semibold',
                !ownerId && 'border-primary border-2 text-primary'
              )}
            >
              <SelectValue placeholder="↓ Selecciona un owner" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((o) => (
                <SelectItem key={o.ownerId} value={o.ownerId} className="text-base py-3">
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!ownerId ? (
        <EmptyState
          icon={Layers}
          title="Selecciona un owner"
          description="Elige el owner para ver y gestionar sus lotes de inventario."
        />
      ) : (
        <>
          {actionError && (
            <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {actionError}
            </div>
          )}

          <div className="flex items-center gap-3 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {selectedOwner?.name ?? 'Lotes'}
              <span className="ml-2 font-normal normal-case tracking-normal">
                ({optimisticLots.length})
              </span>
            </p>
            <Button
              onClick={() => { setActionError(null); setDialogOpen(true); }}
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
        </>
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
