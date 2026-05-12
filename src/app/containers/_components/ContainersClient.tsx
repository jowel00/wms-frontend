'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Plus } from 'lucide-react';
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
import { buildParams } from '@/src/lib/url';
import { useContainers } from '@/hooks/useContainers';
import { useContainerActions } from './useContainerActions';
import { ContainersTable } from './ContainersTable';
import type { Owner, Warehouse, InventoryContainer, Location, ContainerStatus } from '@/src/types/inventory';
import type { PutawayFormValues, MoveFormValues } from '@/src/lib/validations/containers';

const ContainerDialog = dynamic(
  () => import('./ContainerDialog').then((m) => m.ContainerDialog),
  { loading: () => null }
);
const PutawayDialog = dynamic(
  () => import('./PutawayDialog').then((m) => m.PutawayDialog),
  { loading: () => null }
);
const MoveDialog = dynamic(
  () => import('./MoveDialog').then((m) => m.MoveDialog),
  { loading: () => null }
);

const STATUS_OPTIONS: { value: ContainerStatus | ''; label: string }[] = [
  { value: '',           label: 'Todos'      },
  { value: 'CREATED',    label: 'Por ubicar' },
  { value: 'ACTIVE',     label: 'Ubicado'    },
  { value: 'CLOSED',     label: 'Cerrado'    },
  { value: 'QUARANTINE', label: 'Cuarentena' },
];

interface ContainersClientProps {
  owners: Owner[];
  warehouses: Warehouse[];
  locations: Location[];
  containers: InventoryContainer[];
  ownerId: string;
  warehouseId: string;
  status: string;
  locationId: string;
}

function ContainersClientInner({
  owners,
  warehouses,
  locations,
  containers,
  ownerId,
  warehouseId,
  status,
  locationId,
}: ContainersClientProps) {
  const { push } = useRouter();
  const pathname  = usePathname();

  const [receiveOpen, setReceiveOpen]         = useState(false);
  const [putawayOpen, setPutawayOpen]         = useState(false);
  const [moveOpen, setMoveOpen]               = useState(false);
  const [activeContainer, setActiveContainer] = useState<InventoryContainer | null>(null);

  const { optimisticContainers, handleReceive, handlePutaway, handleMove } =
    useContainerActions(containers, locations);

  const filteredWarehouses = ownerId ? warehouses.filter((w) => w.ownerId === ownerId) : [];

  const { binOptions, visible: visibleContainers } = useContainers(
    optimisticContainers,
    locations,
    status,
    locationId
  );

  const selectedOwner     = owners.find((o) => o.ownerId === ownerId);
  const selectedWarehouse = warehouses.find((w) => w.warehouseId === warehouseId);

  function pushParams(params: Record<string, string | undefined>) {
    push(`${pathname}?${buildParams(params)}`);
  }

  function handleOwnerChange(id: string)     { pushParams({ ownerId: id }); }
  function handleWarehouseChange(id: string) { pushParams({ ownerId, warehouseId: id }); }
  function handleStatusChange(val: string) {
    pushParams({ ownerId, warehouseId, status: val || undefined, locationId: undefined });
  }
  function handleLocationChange(val: string) {
    pushParams({ ownerId, warehouseId, status, locationId: val || undefined });
  }

  function openPutaway(container: InventoryContainer) {
    setActiveContainer(container);
    setPutawayOpen(true);
  }

  function openMove(container: InventoryContainer) {
    setActiveContainer(container);
    setMoveOpen(true);
  }

  function onPutawaySubmit(containerId: string, data: PutawayFormValues) {
    handlePutaway(containerId, data);
  }

  function onMoveSubmit(containerId: string, data: MoveFormValues) {
    handleMove(containerId, data);
  }

  const hasWarehouse = !!warehouseId;

  return (
    <>
      {/* Selectores en cascada */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Owner */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            Owner
          </span>
          <Select value={ownerId || undefined} onValueChange={handleOwnerChange}>
            <SelectTrigger aria-label="Owner" className={cn('w-64 h-16 text-base font-semibold', !ownerId && 'border-primary border-2 text-primary')}>
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

        {/* Bodega — visible cuando hay owner */}
        {ownerId && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Bodega
            </span>
            <Select
              value={warehouseId || undefined}
              onValueChange={handleWarehouseChange}
              disabled={filteredWarehouses.length === 0}
            >
              <SelectTrigger aria-label="Bodega" className={cn('w-64 h-16 text-base font-semibold', !warehouseId && 'border-primary border-2 text-primary')}>
                <SelectValue placeholder={filteredWarehouses.length === 0 ? 'Sin bodegas' : '↓ Selecciona una bodega'} />
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

        {/* Estado — visible cuando hay bodega */}
        {warehouseId && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Estado
            </span>
            <Select
              value={status || '__all__'}
              onValueChange={(v) => handleStatusChange(v === '__all__' ? '' : v)}
            >
              <SelectTrigger aria-label="Estado" className="w-48 h-16 text-base font-semibold">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value || '__all__'}
                    value={opt.value || '__all__'}
                    className="text-base py-3"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Ubicación — visible solo cuando status === ACTIVE */}
        {status === 'ACTIVE' && (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Ubicación
            </span>
            <Select
              value={locationId || '__all__'}
              onValueChange={(v) => handleLocationChange(v === '__all__' ? '' : v)}
              disabled={binOptions.length === 0}
            >
              <SelectTrigger aria-label="Ubicación" className="w-56 h-16 text-base font-semibold">
                <SelectValue placeholder={binOptions.length === 0 ? 'Sin bins' : 'Todos los bins'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__" className="text-base py-3 text-muted-foreground">
                  Todos los bins
                </SelectItem>
                {binOptions.map((b) => (
                  <SelectItem key={b.locationId} value={b.locationId} className="text-base py-3">
                    <span className="font-mono font-bold">{b.label}</span>
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
          <div className="flex items-center gap-3 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {selectedWarehouse?.name ?? 'Contenedores'}
              <span className="ml-2 font-normal normal-case tracking-normal">
                ({visibleContainers.length})
              </span>
            </p>
            <Button
              onClick={() => setReceiveOpen(true)}
              className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
              size="lg"
            >
              <Plus className="size-5" />
              Recibir contenedor
            </Button>
          </div>

          {visibleContainers.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Sin contenedores"
              description={
                status
                  ? `No hay contenedores en estado "${STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}".`
                  : 'Esta bodega aún no tiene contenedores. Recibe el primero para comenzar.'
              }
              action={
                !status
                  ? { label: '+ Recibir el primero', onClick: () => setReceiveOpen(true) }
                  : undefined
              }
            />
          ) : (
            <ContainersTable
              containers={visibleContainers}
              locations={locations}
              onPutaway={openPutaway}
              onMove={openMove}
              hideLocation={!!locationId}
            />
          )}
        </>
      )}

      <ContainerDialog
        open={receiveOpen}
        onOpenChange={setReceiveOpen}
        onSubmit={handleReceive}
        lockedOwnerId={ownerId}
        lockedOwnerName={selectedOwner?.name}
        lockedWarehouseId={warehouseId}
        lockedWarehouseName={selectedWarehouse?.name}
      />
      <PutawayDialog
        open={putawayOpen}
        onOpenChange={setPutawayOpen}
        onSubmit={onPutawaySubmit}
        container={activeContainer}
        locations={locations}
      />
      <MoveDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        onSubmit={onMoveSubmit}
        container={activeContainer}
        locations={locations}
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
