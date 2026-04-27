'use client';

import { ChevronRight } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { LocationTypeBadge } from './LocationTypeBadge';
import type { Location } from '@/src/types/inventory';

interface UbicacionesTableProps {
  locations: Location[];
  onRowClick?: (location: Location) => void;
}

export function UbicacionesTable({ locations, onRowClick }: UbicacionesTableProps) {
  const isLeaf = (l: Location) => l.type === 'BIN';

  const columns: Column<Location>[] = [
    {
      key: 'code',
      header: 'Código',
      cell: (l) => (
        <span className="font-mono font-bold text-base tracking-wider">{l.code}</span>
      ),
    },
    {
      key: 'type',
      header: 'Tipo',
      cell: (l) => <LocationTypeBadge type={l.type} />,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (l) => <StatusBadge status={l.active ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'nav',
      header: '',
      headerClassName: 'w-10',
      className: 'text-right',
      cell: (l) =>
        !isLeaf(l) ? (
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            <ChevronRight className="h-4 w-4" />
          </div>
        ) : null,
    },
  ];

  return (
    <DataTable
      data={locations}
      columns={columns}
      keyExtractor={(l) => l.locationId}
      isOptimistic={(l) => l.locationId.startsWith('opt-')}
      onRowClick={onRowClick}
      isClickable={(l) => !isLeaf(l)}
    />
  );
}
