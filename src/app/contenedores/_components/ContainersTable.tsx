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
  showLocationColumn?: boolean;
}

export function ContainersTable({ containers, locations, showLocationColumn = true }: ContainersTableProps) {
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
    cell: (c) => (
      <span className="font-mono font-bold text-base tracking-wider">
        {locationMap.get(c.locationId) ?? c.locationId.slice(0, 8)}
      </span>
    ),
  };

  const columns: Column<InventoryContainer>[] = [
    ...baseColumns,
    ...(showLocationColumn ? [locationColumn] : []),
    {
      key: 'status',
      header: 'Estado',
      cell: (c) => <ContainerStatusBadge status={c.status} />,
    },
    {
      key: 'actions',
      header: '',
      cell: (c) =>
        c.containerId.startsWith('opt-') ? null : (
          <Button asChild variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-wider">
            <Link href={`/contenedores/${c.containerId}`}>Ver líneas →</Link>
          </Button>
        ),
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
