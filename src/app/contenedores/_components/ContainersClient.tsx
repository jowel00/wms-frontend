'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Plus, AlertCircle } from 'lucide-react';
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
import { ContainersTable } from './ContainersTable';
import { createContainer } from '@/src/app/actions/containers';
import type { Owner, Warehouse, InventoryContainer, Location } from '@/src/types/inventory';
import type { ContainerFormValues } from '@/src/lib/validations/containers';

const ContainerDialog = dynamic(
  () => import('./ContainerDialog').then((m) => m.ContainerDialog),
  { loading: () => null }
);

interface ContainersClientProps {
  owners: Owner[];
  warehouses: Warehouse[];
  locations: Location[];
  containers: InventoryContainer[];
  ownerId: string;
  warehouseId: string;
  locationId: string;
}

function ContainersClientInner({
  owners,
  warehouses,
  locations,
  containers,
  ownerId,
  warehouseId,
  locationId,
}: ContainersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startActionTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [optimisticContainers, dispatchOptimistic] = useOptimistic(
    containers,
    (state: InventoryContainer[], newContainer: InventoryContainer) => [
      ...state,
      newContainer,
    ]
  );

  const filteredWarehouses = ownerId
    ? warehouses.filter((w) => w.ownerId === ownerId)
    : [];

  const bins = locations.filter((l) => l.type === 'BIN');

  const visibleContainers = locationId
    ? optimisticContainers.filter((c) => c.locationId === locationId)
    : optimisticContainers;

  function pushParams(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); });
    router.push(`${pathname}?${p.toString()}`);
  }

  function handleOwnerChange(id: string) {
    pushParams({ ownerId: id });
  }

  function handleWarehouseChange(id: string) {
    pushParams({ ownerId, warehouseId: id });
  }

  function handleLocationChange(id: string) {
    pushParams({ ownerId, warehouseId, locationId: id === '__all__' ? undefined : id });
  }

  function handleCreate(data: ContainerFormValues) {
    setActionError(null);

    const temp: InventoryContainer = {
      containerId: `opt-${Date.now()}`,
      ownerId: data.ownerId,
      warehouseId: data.warehouseId,
      locationId: data.locationId,
      type: data.type,
      status: 'CREATED',
    };

    startActionTransition(async () => {
      dispatchOptimistic(temp);
      const result = await createContainer(data);
      if ('error' in result) setActionError(result.error);
    });
  }

  const hasWarehouse = !!warehouseId;
  const selectedWarehouse = warehouses.find((w) => w.warehouseId === warehouseId);

  return (
    <>
      {/* Selectores en cascada */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Owner */}
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

        {/* Bodega — sólo visible tras seleccionar owner */}
        {ownerId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bodega
            </label>
            <Select
              value={warehouseId || undefined}
              onValueChange={handleWarehouseChange}
              disabled={filteredWarehouses.length === 0}
            >
              <SelectTrigger
                className={cn(
                  'w-64 h-16 text-base font-semibold',
                  !warehouseId && 'border-primary border-2 text-primary'
                )}
              >
                <SelectValue
                  placeholder={
                    filteredWarehouses.length === 0
                      ? 'Sin bodegas para este owner'
                      : '↓ Selecciona una bodega'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredWarehouses.map((w) => (
                  <SelectItem key={w.warehouseId} value={w.warehouseId} className="text-base py-3">
                    <span className="font-semibold">{w.name}</span>
                    <span className="ml-2 text-muted-foreground text-sm">{w.city}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Bin — sólo visible tras seleccionar bodega */}
        {warehouseId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bin
            </label>
            <Select
              value={locationId || '__all__'}
              onValueChange={handleLocationChange}
              disabled={bins.length === 0}
            >
              <SelectTrigger className="w-52 h-16 text-base font-semibold">
                <SelectValue
                  placeholder={bins.length === 0 ? 'Sin bins' : 'Todos los bins'}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__" className="text-base py-3 text-muted-foreground">
                  Todos los bins
                </SelectItem>
                {bins.map((b) => (
                  <SelectItem key={b.locationId} value={b.locationId} className="text-base py-3">
                    <span className="font-mono font-bold">{b.code}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!hasWarehouse ? (
        <EmptyState
          icon={Package}
          title="Selecciona owner y bodega"
          description="Elige el owner y la bodega para ver y gestionar sus contenedores de inventario."
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
              {selectedWarehouse?.name ?? 'Contenedores'}
              <span className="ml-2 font-normal normal-case tracking-normal">
                ({visibleContainers.length})
              </span>
            </p>
            <Button
              onClick={() => { setActionError(null); setDialogOpen(true); }}
              className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Nuevo contenedor
            </Button>
          </div>

          {visibleContainers.length === 0 ? (
            <EmptyState
              icon={Package}
              title={locationId ? 'Sin contenedores en este bin' : 'Sin contenedores'}
              description={
                locationId
                  ? 'Este bin no tiene contenedores. Cambia el filtro o crea uno nuevo.'
                  : 'Esta bodega aún no tiene contenedores registrados. Crea el primero para comenzar.'
              }
              action={!locationId ? { label: '+ Crear el primero', onClick: () => setDialogOpen(true) } : undefined}
            />
          ) : (
            <ContainersTable
              containers={visibleContainers}
              locations={locations}
              showLocationColumn={!locationId}
            />
          )}
        </>
      )}

      <ContainerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        owners={owners}
        warehouses={warehouses}
        defaultOwnerId={ownerId}
        defaultWarehouseId={warehouseId}
        onSubmit={handleCreate}
      />
    </>
  );
}

export function ContainersClient(props: ContainersClientProps) {
  return (
    <Suspense>
      <ContainersClientInner {...props} />
    </Suspense>
  );
}

