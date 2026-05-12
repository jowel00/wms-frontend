'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { ContainerStatusBadge } from '@/components/ui/container-status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ContainerLineCard } from './ContainerLineCard';
import { InventoryEventsTable } from './InventoryEventsTable';
import type { ContainerDetail, ContainerLine, ContainerType, ProductListItem, Lot, Location, InventoryEvent } from '@/src/types/inventory';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';

type Tab = 'content' | 'history';

interface ContainerDetailClientProps {
  container: ContainerDetail;
  containerType: string | null;
  lines: ContainerLine[];
  products: ProductListItem[];
  lots: Lot[];
  locationCode: string;
  locations: Location[];
  events: InventoryEvent[];
}

export function ContainerDetailClient({
  container,
  containerType,
  lines,
  products,
  lots,
  locationCode,
  locations,
  events,
}: ContainerDetailClientProps) {
  const { back } = useRouter();
  const productMap = new Map(products.map((p) => [p.productId, p]));
  const lotMap     = new Map(lots.map((l) => [l.lotId, l]));
  const [activeTab, setActiveTab] = useState<Tab>('content');

  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => back()}
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

      {/* Pestañas */}
      <div className="flex gap-1 mb-6 border-b">
        <TabButton
          label="Contenido"
          count={lines.length}
          active={activeTab === 'content'}
          onClick={() => setActiveTab('content')}
        />
        <TabButton
          label="Historial"
          count={events.length}
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        />
      </div>

      {/* Panel: Contenido */}
      {activeTab === 'content' && (
        <>
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
      )}

      {/* Panel: Historial */}
      {activeTab === 'history' && (
        <InventoryEventsTable
          events={events}
          products={products}
          lots={lots}
          locations={locations}
        />
      )}
    </>
  );
}

// ── sub-componente privado ────────────────────────────────────────────────────

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 -mb-px',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground',
      ].join(' ')}
    >
      {label}
      <span className={[
        'ml-2 rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums',
        active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
      ].join(' ')}>
        {count}
      </span>
    </button>
  );
}
