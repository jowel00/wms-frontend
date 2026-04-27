'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { DataTable, type Column } from '@/components/ui/data-table';
import { OwnerStatusToggle } from './OwnerStatusToggle';
import type { Owner } from '@/src/types/inventory';

interface OwnersTableProps {
  owners: Owner[];
  onEdit: (owner: Owner) => void;
}

export function OwnersTable({ owners, onEdit }: OwnersTableProps) {
  const columns: Column<Owner>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (o) => <span className="font-semibold text-base">{o.name}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (o) => (
        <div className="flex items-center gap-3">
          <OwnerStatusToggle ownerId={o.ownerId} status={o.status} />
          <StatusBadge status={o.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Editar',
      headerClassName: 'w-24',
      className: 'text-center',
      cell: (o) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => onEdit(o)}
          aria-label={`Editar ${o.name}`}
        >
          <Pencil className="h-5 w-5" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={owners}
      columns={columns}
      keyExtractor={(o) => o.ownerId}
      isOptimistic={(o) => o.ownerId.startsWith('opt-')}
    />
  );
}
