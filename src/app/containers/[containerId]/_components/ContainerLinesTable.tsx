'use client';

import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import type { ContainerLine, ProductListItem, Lot } from '@/src/types/inventory';

interface ContainerLinesTableProps {
  lines: ContainerLine[];
  products: ProductListItem[];
  lots: Lot[];
}

export function ContainerLinesTable({ lines, products, lots }: ContainerLinesTableProps) {
  const productMap = new Map(products.map((p) => [p.productId, p]));
  const lotMap = new Map(lots.map((l) => [l.lotId, l]));

  const columns: Column<ContainerLine>[] = [
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
      key: 'lotId',
      header: 'Lote',
      cell: (l) => {
        if (!l.lotId) return <span className="text-sm text-muted-foreground">—</span>;
        const lot = lotMap.get(l.lotId);
        return lot?.batchCode ? (
          <span className="font-mono font-bold text-sm tracking-wider">{lot.batchCode}</span>
        ) : (
          <span className="font-mono text-sm text-muted-foreground">
            {l.lotId.slice(0, 8).toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'qtyTotal',
      header: 'Total',
      cell: (l) => (
        <span className="font-bold text-base tabular-nums">{l.qtyTotal.toLocaleString('es-CO')}</span>
      ),
    },
    {
      key: 'qtyAvailable',
      header: 'Disponible',
      cell: (l) => (
        <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15 font-bold text-xs tabular-nums">
          {l.qtyAvailable.toLocaleString('es-CO')}
        </Badge>
      ),
    },
    {
      key: 'qtyReserved',
      header: 'Reservado',
      cell: (l) =>
        l.qtyReserved > 0 ? (
          <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/15 font-bold text-xs tabular-nums">
            {l.qtyReserved.toLocaleString('es-CO')}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">0</span>
        ),
    },
  ];

  return (
    <DataTable
      data={lines}
      columns={columns}
      keyExtractor={(l) => l.containerLineId}
      isOptimistic={(l) => l.containerLineId.startsWith('opt-')}
    />
  );
}
