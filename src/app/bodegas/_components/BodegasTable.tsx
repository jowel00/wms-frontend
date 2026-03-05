'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable, type Column } from '@/components/ui/data-table';
import { BodegaStatusToggle } from './BodegaStatusToggle';
import type { Warehouse } from '@/src/types/inventory';

interface BodegasTableProps {
  warehouses: Warehouse[];
  onEdit: (warehouse: Warehouse) => void;
}

export function BodegasTable({ warehouses, onEdit }: BodegasTableProps) {
  const columns: Column<Warehouse>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (w) => <span className="font-semibold">{w.name}</span>,
    },
    {
      key: 'city',
      header: 'Ciudad',
      cell: (w) => w.city,
    },
    {
      key: 'country',
      header: 'País',
      cell: (w) => w.country,
    },
    {
      key: 'countryCode',
      header: 'ISO',
      cell: (w) => (
        <Badge variant="outline" className="font-mono uppercase tracking-widest text-sm px-2">
          {w.countryCode}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (w) => (
        <div className="flex items-center gap-3">
          <BodegaStatusToggle warehouseId={w.warehouseId} status={w.status} />
          <StatusBadge status={w.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Editar',
      headerClassName: 'w-24',
      className: 'text-center',
      cell: (w) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => onEdit(w)}
          aria-label={`Editar ${w.name}`}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      keyExtractor={(w) => w.warehouseId}
      isOptimistic={(w) => w.warehouseId.startsWith('opt-')}
    />
  );
}
