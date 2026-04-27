'use client';

import { DataTable, type Column } from '@/components/ui/data-table';
import { LotExpirationBadge } from './LotExpirationBadge';
import type { Lot, ProductListItem } from '@/src/types/inventory';

interface LotsTableProps {
  lots: Lot[];
  products: ProductListItem[];
}

export function LotsTable({ lots, products }: LotsTableProps) {
  const productMap = new Map(products.map((p) => [p.productId, p]));

  const columns: Column<Lot>[] = [
    {
      key: 'lotId',
      header: 'ID Lote',
      cell: (l) => (
        <span className="font-mono text-sm text-muted-foreground">
          {l.lotId.slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'productId',
      header: 'Producto',
      cell: (l) => {
        const p = productMap.get(l.productId);
        return p ? (
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{p.name}</span>
            <span className="text-xs text-muted-foreground font-mono">{p.sellerSku}</span>
          </div>
        ) : (
          <span className="font-mono text-sm text-muted-foreground">
            {l.productId.slice(0, 8).toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'batchCode',
      header: 'Código de Lote',
      cell: (l) =>
        l.batchCode ? (
          <span className="font-mono font-bold text-sm tracking-wider">{l.batchCode}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      key: 'expiresAt',
      header: 'Vencimiento',
      cell: (l) => <LotExpirationBadge expiresAt={l.expiresAt} />,
    },
    {
      key: 'receivedAt',
      header: 'Recibido',
      cell: (l) =>
        l.receivedAt ? (
          <span className="text-sm text-muted-foreground">
            {new Date(l.receivedAt + 'T00:00:00').toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <DataTable
      data={lots}
      columns={columns}
      keyExtractor={(l) => l.lotId}
      isOptimistic={(l) => l.lotId.startsWith('opt-')}
    />
  );
}
