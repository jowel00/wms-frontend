'use client';

import { useState, useOptimistic, useTransition, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { MapPin, Rows3, Archive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ActionError } from '@/components/ui/action-error';
import { WarehouseSelector } from './WarehouseSelector';
import { UbicacionesTable } from './UbicacionesTable';
import { DrilldownBreadcrumb } from './DrilldownBreadcrumb';
import { createLocation } from '@/src/app/actions/locations';
import type { Location, Warehouse } from '@/src/types/inventory';
import type { LocationFormValues } from '@/src/lib/validations/locations';

const UbicacionDialog = dynamic(
  () => import('./UbicacionDialog').then((m) => m.UbicacionDialog),
  { loading: () => null }
);

interface UbicacionesClientProps {
  warehouses: Warehouse[];
  locations: Location[];
  warehouseId: string;
  aisleId?: string;
  aisleCode?: string;
  rackId?: string;
  rackCode?: string;
}

type DrillLevel = 'WAREHOUSE' | 'PASILLO' | 'RACK' | 'BIN';

function getLevel(warehouseId: string, aisleId?: string, rackId?: string): DrillLevel {
  if (!warehouseId) return 'WAREHOUSE';
  if (rackId) return 'BIN';
  if (aisleId) return 'RACK';
  return 'PASILLO';
}

const LEVEL_META = {
  WAREHOUSE: { icon: MapPin, title: '', hint: '', emptyTitle: '', emptyDesc: '' },
  PASILLO: {
    icon: Rows3,
    title: 'Pasillos',
    hint: 'Haz clic en un pasillo para explorar sus racks.',
    emptyTitle: 'Sin pasillos',
    emptyDesc: 'Esta bodega aún no tiene pasillos. Crea el primero para empezar a organizar el espacio.',
  },
  RACK: {
    icon: Archive,
    title: 'Racks',
    hint: 'Haz clic en un rack para ver sus bins (posiciones de almacenamiento).',
    emptyTitle: 'Sin racks',
    emptyDesc: 'Este pasillo aún no tiene racks. Agrega uno para poder crear bins.',
  },
  BIN: {
    icon: MapPin,
    title: 'Bins',
    hint: 'Los bins son las posiciones individuales donde se ubica el inventario.',
    emptyTitle: 'Sin bins',
    emptyDesc: 'Este rack aún no tiene bins. Agrega el primero para comenzar a almacenar inventario.',
  },
} as const;

function UbicacionesClientInner({
  warehouses,
  locations,
  warehouseId,
  aisleId,
  aisleCode,
  rackId,
  rackCode,
}: UbicacionesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startActionTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [optimisticLocations, dispatchOptimistic] = useOptimistic(
    locations,
    (state: Location[], newLoc: Location) => {
      // Activar el padre optimistamente si aplica (RACK activa PASILLO, BIN activa RACK)
      const withParentActivated = newLoc.parentLocationId
        ? state.map((l) =>
            l.locationId === newLoc.parentLocationId ? { ...l, active: true } : l
          )
        : state;
      return [...withParentActivated, newLoc];
    }
  );

  const level = getLevel(warehouseId, aisleId, rackId);
  const warehouse = warehouses.find((w) => w.warehouseId === warehouseId);

  function buildUrl(params: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) p.set(k, v); });
    return `${pathname}?${p.toString()}`;
  }

  function handleRowClick(location: Location) {
    if (location.type === 'PASILLO') {
      router.push(buildUrl({ warehouseId, aisleId: location.locationId, aisleCode: location.code }));
    } else if (location.type === 'RACK') {
      router.push(buildUrl({ warehouseId, aisleId, aisleCode, rackId: location.locationId, rackCode: location.code }));
    }
  }

  function handleCreate(data: LocationFormValues) {
    setActionError(null);

    // Sólo mostrar optimistic si la nueva ubicación pertenece al nivel actual
    const currentParentId = rackId ?? aisleId ?? null;
    const newParentId = data.parentLocationId ?? null;

    const belongsHere =
      (level === 'PASILLO' && data.typeName === 'PASILLO' && newParentId === null) ||
      (level === 'RACK'    && data.typeName === 'RACK'    && newParentId === aisleId) ||
      (level === 'BIN'     && data.typeName === 'BIN'     && newParentId === rackId);

    const temp: Location = {
      locationId: `opt-${Date.now()}`,
      warehouseId,
      type: data.typeName as Location['type'],
      code: '…', // el backend genera el código; placeholder hasta revalidar
      parentLocationId: newParentId,
      active: true,
    };

    startActionTransition(async () => {
      if (belongsHere) dispatchOptimistic(temp);
      const result = await createLocation(data);
      if ('error' in result) setActionError(result.error);
    });
  }

  // Breadcrumb items
  const breadcrumbItems = warehouse ? (() => {
    const warehouseUrl = buildUrl({ warehouseId });
    const items: { label: string; href?: string }[] = [
      { label: warehouse.name, href: level !== 'PASILLO' ? warehouseUrl : undefined },
    ];
    if (aisleCode) {
      const aisleUrl = buildUrl({ warehouseId, aisleId, aisleCode });
      items.push({ label: aisleCode, href: level !== 'RACK' ? aisleUrl : undefined });
    }
    if (rackCode) items.push({ label: rackCode });
    return items;
  })() : [];

  const meta = LEVEL_META[level];
  const levelTitle =
    level === 'RACK' ? `Racks — ${aisleCode}` :
    level === 'BIN'  ? `Bins — ${rackCode}`   :
    meta.title;

  return (
    <>
      <div className="mb-6">
        <WarehouseSelector warehouses={warehouses} value={warehouseId} />
      </div>

      {level === 'WAREHOUSE' ? (
        <EmptyState
          icon={MapPin}
          title="Selecciona una bodega"
          description="Elige una bodega del selector de arriba para ver y gestionar sus ubicaciones."
        />
      ) : (
        <>
          {breadcrumbItems.length > 0 && (
            <DrilldownBreadcrumb items={breadcrumbItems} />
          )}

          {meta.hint && (
            <p className="text-sm text-muted-foreground mb-5">
              {meta.hint}
            </p>
          )}

          <ActionError message={actionError} />

          <div className="flex items-center gap-3 mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {levelTitle}
              <span className="ml-2 font-normal normal-case tracking-normal">
                ({optimisticLocations.length})
              </span>
            </p>
            <Button
              onClick={() => { setActionError(null); setDialogOpen(true); }}
              className="ml-auto h-14 px-6 text-base font-bold uppercase tracking-wider gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Nueva ubicación
            </Button>
          </div>

          {optimisticLocations.length === 0 ? (
            <EmptyState
              icon={meta.icon}
              title={meta.emptyTitle}
              description={meta.emptyDesc}
              action={{ label: '+ Agregar la primera', onClick: () => setDialogOpen(true) }}
            />
          ) : (
            <UbicacionesTable
              locations={optimisticLocations}
              onRowClick={level !== 'BIN' ? handleRowClick : undefined}
            />
          )}

          <UbicacionDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            warehouseId={warehouseId}
            onSubmit={handleCreate}
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
