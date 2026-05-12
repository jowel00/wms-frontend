'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ContainerStatusBadge } from '@/components/ui/container-status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ContainerLineCard } from './ContainerLineCard';
import type { ContainerDetail, ContainerLine, ContainerType, ProductListItem, Lot } from '@/src/types/inventory';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';

interface ContainerDetailClientProps {
  container: ContainerDetail;
  containerType: string | null;
  lines: ContainerLine[];
  products: ProductListItem[];
  lots: Lot[];
  locationCode: string;
}

export function ContainerDetailClient({
  container,
  containerType,
  lines,
  products,
  lots,
  locationCode,
}: ContainerDetailClientProps) {
  const router     = useRouter();
  const productMap = new Map(products.map((p) => [p.productId, p]));
  const lotMap     = new Map(lots.map((l) => [l.lotId, l]));

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a contenedores
        </button>
      </div>

      {/* Metadata del contenedor */}
      <div className="flex flex-wrap items-start gap-6 mb-8 p-5 rounded-xl border bg-card">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ID</span>
          <span className="font-mono font-bold text-base">
            {container.containerId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tipo</span>
          <span className="font-semibold text-base">
            {(containerType && CONTAINER_TYPE_LABELS[containerType as ContainerType]) ?? containerType ?? '—'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ubicación</span>
          <span className="font-mono font-bold text-base tracking-wider">{locationCode}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Estado</span>
          <ContainerStatusBadge status={container.status} />
        </div>
      </div>

      {/* Contenido */}
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Contenido
        <span className="ml-2 font-normal normal-case tracking-normal">
          ({lines.length} {lines.length === 1 ? 'línea' : 'líneas'})
        </span>
      </p>

      {lines.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Sin contenido"
          description="Este contenedor no tiene líneas de producto registradas."
        />
      ) : (
        <div className="space-y-4">
          {lines.map((line) => (
            <ContainerLineCard
              key={line.containerLineId}
              line={line}
              product={productMap.get(line.productId)}
              lot={line.lotId ? lotMap.get(line.lotId) : undefined}
            />
          ))}
        </div>
      )}
    </>
  );
}
