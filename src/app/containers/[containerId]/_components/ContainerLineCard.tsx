'use client';

import { Badge } from '@/components/ui/badge';
import type { ContainerLine, ProductListItem, Lot } from '@/src/types/inventory';

interface ContainerLineCardProps {
  line: ContainerLine;
  product: ProductListItem | undefined;
  lot: Lot | undefined;
}

export function ContainerLineCard({ line, product, lot }: ContainerLineCardProps) {
  const reserved = line.qtyReserved ?? 0;

  return (
    <div className="rounded-xl border bg-card p-6 space-y-5">
      {/* Producto */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Producto
          </p>
          <p className="text-xl font-bold">
            {product?.name ?? line.productId.slice(0, 8).toUpperCase()}
          </p>
        </div>
        {product?.sellerSku && (
          <Badge variant="outline" className="font-mono text-xs tracking-wider shrink-0">
            {product.sellerSku}
          </Badge>
        )}
      </div>

      <hr className="border-dashed" />

      {/* Cantidades */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Cantidades
        </p>
        <div className="grid grid-cols-3 gap-3">
          <QuantityBlock label="Total" value={line.qtyTotal} />
          <QuantityBlock label="Disponible" value={line.qtyAvailable} highlight="green" />
          <QuantityBlock label="Reservado" value={reserved} highlight={reserved > 0 ? 'amber' : undefined} />
        </div>
      </div>

      {/* Lote — solo si existe */}
      {lot && (
        <>
          <hr className="border-dashed" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Lote
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {lot.batchCode && (
                <LotField label="Código" value={lot.batchCode} mono />
              )}
              {lot.receivedAt && (
                <LotField label="Recibido" value={lot.receivedAt} />
              )}
              {lot.expiresAt && (
                <LotField label="Vence" value={lot.expiresAt} expires />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── sub-componentes privados ──────────────────────────────────────────────────

function QuantityBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: 'green' | 'amber';
}) {
  const colorClass =
    highlight === 'green'
      ? 'text-emerald-600'
      : highlight === 'amber'
      ? 'text-amber-600'
      : 'text-foreground';

  return (
    <div className="flex flex-col items-center rounded-lg border bg-muted/30 py-3 px-2 gap-1">
      <span className={`text-2xl font-bold tabular-nums ${colorClass}`}>
        {value.toLocaleString('es-CO')}
      </span>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function LotField({
  label,
  value,
  mono = false,
  expires = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  expires?: boolean;
}) {
  const isExpired = expires && value < new Date().toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span
        className={[
          'text-sm font-semibold',
          mono ? 'font-mono tracking-wider' : '',
          isExpired ? 'text-destructive' : '',
        ].join(' ').trim()}
      >
        {value}
        {isExpired && (
          <span className="ml-1.5 text-xs font-normal">(vencido)</span>
        )}
      </span>
    </div>
  );
}
