'use client';

import Link from 'next/link';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContainerStatusBadge } from '@/components/ui/container-status-badge';
import type { InventoryContainer, Location } from '@/src/types/inventory';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';

interface ContainersTableProps {
  containers: InventoryContainer[];
  locations: Location[];
  onPutaway?: (container: InventoryContainer) => void;
  onMove?: (container: InventoryContainer) => void;
  hideLocation?: boolean;
}

export function ContainersTable({
  containers,
  locations,
  onPutaway,
  onMove,
  hideLocation = false,
}: ContainersTableProps) {
  const locationMap = new Map(locations.map((l) => [l.locationId, l.code]));

  const baseColumns: Column<InventoryContainer>[] = [
    {
      key: 'containerId',
      header: 'ID',
      cell: (c) => (
        <span className="font-mono text-sm text-muted-foreground">
          {c.containerId.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      cell: (c) => (
        <Badge variant="outline" className="font-bold text-xs uppercase tracking-wider">
          {CONTAINER_TYPE_LABELS[c.type] ?? c.type}
        </Badge>
      ),
    },
  ];

  const locationColumn: Column<InventoryContainer> = {
    key: 'locationId',
    header: 'Ubicación',
    cell: (c) =>
      c.locationId ? (
        <span className="font-mono font-bold text-base tracking-wider">
          {locationMap.get(c.locationId) ?? c.locationId.slice(0, 8)}
        </span>
      ) : (
        <span className="text-muted-foreground text-sm italic">Sin ubicar</span>
      ),
  };

  const columns: Column<InventoryContainer>[] = [
    ...baseColumns,
    ...(hideLocation ? [] : [locationColumn]),
    {
      key: 'status',
      header: 'Estado',
      cell: (c) => <ContainerStatusBadge status={c.status} />,
    },
    {
      key: 'actions',
      header: '',
      cell: (c) => {
        if (c.containerId.startsWith('opt-')) return null;
        return (
          <div className="flex items-center gap-2 justify-end">
            {/* PUTAWAY — solo en estado CREATED */}
            {c.status === 'CREATED' && onPutaway && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPutaway(c)}
                className="text-xs font-bold uppercase tracking-wider h-9 px-3"
              >
                Ubicar
              </Button>
            )}
            {/* MOVE — disponible en ACTIVE */}
            {c.status === 'ACTIVE' && onMove && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMove(c)}
                className="text-xs font-bold uppercase tracking-wider h-9 px-3"
              >
                Mover
              </Button>
            )}
            <Button asChild variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider">
              <Link href={`/containers/${c.containerId}?ownerId=${c.ownerId}&warehouseId=${c.warehouseId}&type=${encodeURIComponent(c.type)}`}>
                Ver líneas →
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={containers}
      columns={columns}
      keyExtractor={(c) => c.containerId}
      isOptimistic={(c) => c.containerId.startsWith('opt-')}
    />
  );
}
