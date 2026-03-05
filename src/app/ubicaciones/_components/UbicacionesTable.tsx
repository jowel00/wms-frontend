'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, type Column } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { LocationTypeBadge } from './LocationTypeBadge';
import { LocationStatusToggle } from './LocationStatusToggle';
import type { Location } from '@/src/types/inventory';

interface UbicacionesTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
}

const dash = <span className="text-muted-foreground select-none">—</span>;

export function UbicacionesTable({ locations, onEdit }: UbicacionesTableProps) {
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
      key: 'aisle',
      header: 'Pasillo',
      cell: (l) => l.aisle ? <span className="font-mono">{l.aisle}</span> : dash,
    },
    {
      key: 'rack',
      header: 'Rack',
      cell: (l) => l.rack ? <span className="font-mono">{l.rack}</span> : dash,
    },
    {
      key: 'bin',
      header: 'Bin',
      cell: (l) => l.bin ? <span className="font-mono">{l.bin}</span> : dash,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (l) => (
        <div className="flex items-center gap-3">
          <LocationStatusToggle locationId={l.locationId} status={l.status} />
          <StatusBadge status={l.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Editar',
      headerClassName: 'w-24',
      className: 'text-center',
      cell: (l) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => onEdit(l)}
          aria-label={`Editar ${l.code}`}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={locations}
      columns={columns}
      keyExtractor={(l) => l.locationId}
      isOptimistic={(l) => l.locationId.startsWith('opt-')}
    />
  );
}
