'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Warehouse as WarehouseIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { EmptyState } from '@/components/ui/empty-state';
import { ActionError } from '@/components/ui/action-error';
import { OwnerSelect } from '@/components/ui/owner-select';
import { useWarehouses } from '@/hooks/useWarehouses';
import { createWarehouse, updateWarehouse } from '@/src/app/actions/warehouses';
import { BodegasTable } from './BodegasTable';
import type { Owner, Warehouse } from '@/src/types/inventory';
import type { WarehouseFormValues } from '@/src/lib/validations/warehouses';

const BodegaDialog = dynamic(
  () => import('./BodegaDialog').then((m) => m.BodegaDialog),
  { loading: () => null }
);

type OptimisticAction =
  | { type: 'add'; warehouse: Warehouse }
  | { type: 'update'; warehouse: Warehouse };

interface BodegasClientProps {
  warehouses: Warehouse[];
  owners: Owner[];
  initialSearch: string;
  initialOwnerFilter: string;
}

function BodegasClientInner({
  warehouses,
  owners,
  initialSearch,
  initialOwnerFilter,
}: BodegasClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startActionTransition] = useTransition();

  const [optimisticWarehouses, dispatchOptimistic] = useOptimistic(
    warehouses,
    (state: Warehouse[], action: OptimisticAction) => {
      if (action.type === 'add') return [...state, action.warehouse];
      return state.map((w) =>
        w.warehouseId === action.warehouse.warehouseId ? action.warehouse : w
      );
    }
  );

  const { search, setSearch, ownerFilter, setOwnerFilter, filtered: optimisticFiltered } = useWarehouses(
    optimisticWarehouses,
    initialSearch,
    initialOwnerFilter
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function handleOwnerFilter(val: string) {
    setOwnerFilter(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('ownerId', val);
    } else {
      params.delete('ownerId');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function openCreate() {
    setEditingWarehouse(null);
    setActionError(null);
    setDialogOpen(true);
  }

  function openEdit(w: Warehouse) {
    setEditingWarehouse(w);
    setActionError(null);
    setDialogOpen(true);
  }

  function handleSubmit(data: WarehouseFormValues) {
    setActionError(null);

    if (editingWarehouse) {
      const updated: Warehouse = { ...editingWarehouse, ...data };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'update', warehouse: updated });
        const result = await updateWarehouse(editingWarehouse.warehouseId, data);
        if ('error' in result) setActionError(result.error);
      });
    } else {
      const temp: Warehouse = {
        warehouseId: `opt-${Date.now()}`,
        status: 'ACTIVE',
        ...data,
      };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'add', warehouse: temp });
        const result = await createWarehouse(data);
        if ('error' in result) setActionError(result.error);
      });
    }
  }

  return (
    <>
      <ActionError message={actionError} />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <SearchInput
          placeholder="Buscar bodega..."
          initialValue={initialSearch}
          onSearch={setSearch}
          className="w-72"
        />
        <OwnerSelect owners={owners} value={ownerFilter} onChange={handleOwnerFilter} className="w-60" />
        <Button
          onClick={openCreate}
          className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Nueva bodega
        </Button>
      </div>

      {optimisticFiltered.length === 0 ? (
        <EmptyState
          icon={WarehouseIcon}
          title="No se encontraron bodegas"
          description={
            search || ownerFilter
              ? 'Sin resultados para los filtros aplicados. Intenta con otros criterios.'
              : 'Aún no hay bodegas registradas. Crea la primera para comenzar.'
          }
          action={
            !search && !ownerFilter
              ? { label: '+ Agregar la primera', onClick: openCreate }
              : undefined
          }
        />
      ) : (
        <BodegasTable warehouses={optimisticFiltered} onEdit={openEdit} />
      )}

      <BodegaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        warehouse={editingWarehouse}
        owners={owners}
        warehouses={optimisticWarehouses}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export function BodegasClient(props: BodegasClientProps) {
  return (
    <Suspense>
      <BodegasClientInner {...props} />
    </Suspense>
  );
}
