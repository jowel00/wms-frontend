'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import { EmptyState } from '@/components/ui/empty-state';
import { useLocations } from '@/hooks/useLocations';
import { createLocation, updateLocation } from '@/src/app/actions/locations';
import { WarehouseSelector } from './WarehouseSelector';
import { UbicacionesTable } from './UbicacionesTable';
import type { Location, Warehouse } from '@/src/types/inventory';
import type { LocationFormValues } from '@/src/lib/validations/locations';

const UbicacionDialog = dynamic(
  () => import('./UbicacionDialog').then((m) => m.UbicacionDialog),
  { loading: () => null }
);

type OptimisticAction =
  | { type: 'add'; location: Location }
  | { type: 'update'; location: Location };

interface UbicacionesClientProps {
  warehouses: Warehouse[];
  locations: Location[];
  initialSearch: string;
  initialWarehouseId: string;
}

function UbicacionesClientInner({
  warehouses,
  locations,
  initialSearch,
  initialWarehouseId,
}: UbicacionesClientProps) {
  const [searchPending, startSearchTransition] = useTransition();
  const [, startActionTransition] = useTransition();

  const [optimisticLocations, dispatchOptimistic] = useOptimistic(
    locations,
    (state: Location[], action: OptimisticAction) => {
      if (action.type === 'add') return [...state, action.location];
      return state.map((l) =>
        l.locationId === action.location.locationId ? action.location : l
      );
    }
  );

  // Hook recibe la lista optimista — un único useState interno maneja el search
  const { search, setSearch, filtered: optimisticFiltered } = useLocations(optimisticLocations, initialSearch);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  function handleSearch(value: string) {
    startSearchTransition(() => setSearch(value));
  }

  function openCreate() {
    setEditingLocation(null);
    setActionError(null);
    setDialogOpen(true);
  }

  function openEdit(loc: Location) {
    setEditingLocation(loc);
    setActionError(null);
    setDialogOpen(true);
  }

  function handleSubmit(data: LocationFormValues) {
    setActionError(null);

    if (editingLocation) {
      const updated: Location = { ...editingLocation, ...data };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'update', location: updated });
        const result = await updateLocation(editingLocation.locationId, data);
        if ('error' in result) setActionError(result.error);
      });
    } else {
      const temp: Location = {
        locationId: `opt-${Date.now()}`,
        status: 'ACTIVE',
        ...data,
      };
      startActionTransition(async () => {
        dispatchOptimistic({ type: 'add', location: temp });
        const result = await createLocation(data);
        if ('error' in result) setActionError(result.error);
      });
    }
  }

  return (
    <>
      <div className="mb-6">
        <WarehouseSelector warehouses={warehouses} value={initialWarehouseId} />
      </div>

      {!initialWarehouseId ? (
        <EmptyState
          icon={MapPin}
          title="Selecciona una bodega"
          description="Elige una bodega del selector de arriba para ver y gestionar sus ubicaciones."
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
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Buscar código, tipo, pasillo..."
              isPending={searchPending}
              className="w-72"
            />
            <Button
              onClick={openCreate}
              className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Nueva ubicación
            </Button>
          </div>

          {optimisticFiltered.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No se encontraron ubicaciones"
              description={
                search
                  ? `Sin resultados para "${search}". Intenta con otro código o tipo.`
                  : 'Esta bodega aún no tiene ubicaciones. Crea la primera.'
              }
              action={!search ? { label: '+ Agregar la primera', onClick: openCreate } : undefined}
            />
          ) : (
            <UbicacionesTable locations={optimisticFiltered} onEdit={openEdit} />
          )}

          <UbicacionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            location={editingLocation}
            warehouseId={initialWarehouseId}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
}

export function UbicacionesClient(props: UbicacionesClientProps) {
  return (
    <Suspense>
      <UbicacionesClientInner {...props} />
    </Suspense>
  );
}
