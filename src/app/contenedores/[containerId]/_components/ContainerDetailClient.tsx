'use client';

import { useState, useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ContainerStatusBadge } from '@/components/ui/container-status-badge';
import { ActionError } from '@/components/ui/action-error';
import { ContainerLinesTable } from './ContainerLinesTable';
import { AddLineDialog } from './AddLineDialog';
import { createContainerLine } from '@/src/app/actions/containerLines';
import type { InventoryContainer, ContainerLine, ProductListItem, Lot } from '@/src/types/inventory';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';
import type { ContainerLineFormValues } from '@/src/lib/validations/containerLines';

interface ContainerDetailClientProps {
  container: InventoryContainer;
  lines: ContainerLine[];
  products: ProductListItem[];
  lots: Lot[];
  locationCode: string;
}

export function ContainerDetailClient({
  container,
  lines,
  products,
  lots,
  locationCode,
}: ContainerDetailClientProps) {
  const [, startActionTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [optimisticLines, dispatchOptimistic] = useOptimistic(
    lines,
    (state: ContainerLine[], newLine: ContainerLine) => [...state, newLine]
  );

  function handleCreate(data: ContainerLineFormValues) {
    setActionError(null);

    const temp: ContainerLine = {
      containerLineId: `opt-${Date.now()}`,
      containerId: container.containerId,
      productId: data.productId,
      lotId: data.lotId ?? null,
      qtyTotal: data.qtyTotal,
      qtyAvailable: data.qtyTotal,
      qtyReserved: 0,
    };

    startActionTransition(async () => {
      dispatchOptimistic(temp);
      const result = await createContainerLine(container.containerId, data);
      if ('error' in result) setActionError(result.error);
    });
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/contenedores"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a contenedores
        </Link>
      </div>

      {/* Info del contenedor */}
      <div className="flex flex-wrap items-start gap-6 mb-8 p-5 rounded-xl border bg-card">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ID</span>
          <span className="font-mono font-bold text-base">
            {container.containerId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipo</span>
          <span className="font-semibold text-base">
            {CONTAINER_TYPE_LABELS[container.type] ?? container.type.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ubicación</span>
          <span className="font-mono font-bold text-base tracking-wider">{locationCode}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estado</span>
          <ContainerStatusBadge status={container.status} />
        </div>
      </div>

      {/* Líneas */}
      <div className="flex items-center gap-3 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Líneas
          <span className="ml-2 font-normal normal-case tracking-normal">
            ({optimisticLines.length})
          </span>
        </p>
        <Button
          onClick={() => { setActionError(null); setDialogOpen(true); }}
          className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
          size="lg"
          disabled={container.status === 'CLOSED'}
        >
          <Plus className="h-5 w-5" />
          Agregar línea
        </Button>
      </div>

      <ActionError message={actionError} />

      {optimisticLines.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin líneas"
          description="Este contenedor no tiene productos. Agrega la primera línea."
          action={
            container.status !== 'CLOSED'
              ? { label: '+ Agregar línea', onClick: () => setDialogOpen(true) }
              : undefined
          }
        />
      ) : (
        <ContainerLinesTable
          lines={optimisticLines}
          products={products}
          lots={lots}
        />
      )}

      <AddLineDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ownerId={container.ownerId}
        onSubmit={handleCreate}
      />
    </>
  );
}
