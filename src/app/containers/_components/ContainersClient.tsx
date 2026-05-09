'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Plus } from 'lucide-react';
import { toast } from 'sonner';
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
import { ContainersTable } from './ContainersTable';
import {
  receiveContainerAction,
  putawayContainerAction,
  moveContainerAction,
} from '@/src/app/actions/containers';
import { formatBackendError } from '@/src/lib/formatError';
import type { Owner, Warehouse, InventoryContainer, Location, ContainerStatus } from '@/src/types/inventory';
import type { ReceiveFormValues, PutawayFormValues, MoveFormValues } from '@/src/lib/validations/containers';

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
  { value: '',            label: 'Todos'       },
  { value: 'CREATED',    label: 'Por ubicar'  },
  { value: 'ACTIVE',     label: 'Ubicado'     },
  { value: 'CLOSED',     label: 'Cerrado'     },
  { value: 'QUARANTINE', label: 'Cuarentena'  },
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
  const router   = useRouter();
  const pathname = usePathname();
  const [, startActionTransition] = useTransition();

  const [receiveOpen, setReceiveOpen]         = useState(false);
  const [putawayOpen, setPutawayOpen]         = useState(false);
  const [moveOpen, setMoveOpen]               = useState(false);
  const [activeContainer, setActiveContainer] = useState<InventoryContainer | null>(null);

  const [optimisticContainers, dispatchOptimistic] = useOptimistic(
    containers,
    (state: InventoryContainer[], action:
      | { type: 'add';    container: InventoryContainer }
      | { type: 'update'; containerId: string; patch: Partial<InventoryContainer> }
    ) => {
      if (action.type === 'add')    return [...state, action.container];
      if (action.type === 'update') return state.map((c) =>
        c.containerId === action.containerId ? { ...c, ...action.patch } : c
      );
      return state;
    }
  );

  const filteredWarehouses = ownerId ? warehouses.filter((w) => w.ownerId === ownerId) : [];

  const { binOptions, visible: visibleContainers } = useContainers(
    optimisticContainers,
    locations,
    status,
    locationId
  );

  function pushParams(params: Record<string, string | undefined>) {
    router.push(`${pathname}?${buildParams(params)}`);
  }

  function handleOwnerChange(id: string)     { pushParams({ ownerId: id }); }
  function handleWarehouseChange(id: string) { pushParams({ ownerId, warehouseId: id }); }
  function handleStatusChange(val: string) {
    // Al cambiar de status se limpia el filtro de ubicación
    pushParams({ ownerId, warehouseId, status: val || undefined, locationId: undefined });
  }
  function handleLocationChange(val: string) {
    pushParams({ ownerId, warehouseId, status, locationId: val || undefined });
  }

  // ── RECEIVE ────────────────────────────────────────────────────────────────
  function handleReceive(data: ReceiveFormValues) {
    const temp: InventoryContainer = {
      containerId: `opt-${Date.now()}`,
      ownerId:     data.ownerId,
      warehouseId: data.warehouseId,
      locationId:  null,
      type:        '',
      status:      'CREATED',
    };
    startActionTransition(async () => {
      dispatchOptimistic({ type: 'add', container: temp });
      const result = await receiveContainerAction(data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else toast.success('Contenedor recibido — pendiente de putaway');
    });
  }

  // ── PUTAWAY ────────────────────────────────────────────────────────────────
  function openPutaway(container: InventoryContainer) {
    setActiveContainer(container);
    setPutawayOpen(true);
  }

  function handlePutaway(containerId: string, data: PutawayFormValues) {
    startActionTransition(async () => {
      dispatchOptimistic({ type: 'update', containerId, patch: { locationId: data.locationId, status: 'ACTIVE' } });
      const result = await putawayContainerAction(containerId, data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else {
        const bin = locations.find((l) => l.locationId === data.locationId);
        toast.success(`Putaway confirmado${bin ? ` — ${bin.code}` : ''}`);
      }
    });
  }

  // ── MOVE ───────────────────────────────────────────────────────────────────
  function openMove(container: InventoryContainer) {
    setActiveContainer(container);
    setMoveOpen(true);
  }

  function handleMove(containerId: string, data: MoveFormValues) {
    startActionTransition(async () => {
      dispatchOptimistic({ type: 'update', containerId, patch: { locationId: data.toLocationId } });
      const result = await moveContainerAction(containerId, data);
      if ('error' in result) toast.error(formatBackendError(result.error));
      else {
        const bin = locations.find((l) => l.locationId === data.toLocationId);
        toast.success(`Contenedor movido${bin ? ` → ${bin.code}` : ''}`);
      }
    });
  }

  const hasWarehouse      = !!warehouseId;
  const selectedOwner     = owners.find((o) => o.ownerId === ownerId);
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
            <SelectTrigger className={cn('w-64 h-16 text-base font-semibold', !ownerId && 'border-primary border-2 text-primary')}>
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

        {/* Bodega */}
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
              <SelectTrigger className={cn('w-64 h-16 text-base font-semibold', !warehouseId && 'border-primary border-2 text-primary')}>
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

        {/* Status — visible cuando hay bodega */}
        {warehouseId && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Estado
            </label>
            <Select value={status || '__all__'} onValueChange={(v) => handleStatusChange(v === '__all__' ? '' : v)}>
              <SelectTrigger className="w-48 h-16 text-base font-semibold">
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

        {/* Bin — visible solo cuando status === ACTIVE */}
        {status === 'ACTIVE' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Ubicación
            </label>
            <Select
              value={locationId || '__all__'}
              onValueChange={(v) => handleLocationChange(v === '__all__' ? '' : v)}
              disabled={binOptions.length === 0}
            >
              <SelectTrigger className="w-56 h-16 text-base font-semibold">
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
              <Plus className="h-5 w-5" />
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
        onSubmit={handlePutaway}
        container={activeContainer}
        locations={locations}
      />
      <MoveDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        onSubmit={handleMove}
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
