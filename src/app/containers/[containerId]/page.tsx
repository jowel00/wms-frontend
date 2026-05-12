import { notFound } from 'next/navigation';
import { fetchContainerById } from '@/src/services/containerService';
import { PageHeader } from '@/components/ui/page-header';
import { fetchContainerLines } from '@/src/services/containerLineService';
import { fetchProducts } from '@/src/services/productService';
import { fetchLots } from '@/src/services/lotService';
import { fetchAllLocations } from '@/src/services/locationService';
import { fetchInventoryEvents } from '@/src/services/inventoryEventService';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';
import type { ContainerType } from '@/src/types/inventory';
import { ContainerDetailClient } from './_components/ContainerDetailClient';

interface PageProps {
  params: Promise<{ containerId: string }>;
  searchParams: Promise<{ ownerId?: string; warehouseId?: string; type?: string }>;
}

export default async function ContainerDetailPage({ params, searchParams }: PageProps) {
  const [{ containerId }, { ownerId, warehouseId, type }] = await Promise.all([params, searchParams]);

  const [container, lines, productsData, allLots, locations, events] = await Promise.all([
    fetchContainerById(containerId).catch(() => null),
    fetchContainerLines(containerId).catch(() => []),
    ownerId ? fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null) : Promise.resolve(null),
    fetchLots().catch(() => []),
    warehouseId ? fetchAllLocations(warehouseId).catch(() => []) : Promise.resolve([]),
    fetchInventoryEvents(containerId).catch(() => []),
  ]);

  if (!container) notFound();

  const locationCode = container.location ?? 'Sin ubicar';
  const products = productsData?.data ?? [];
  const lots = allLots.filter((l) => l.ownerId === ownerId);

  return (
    <div className="p-6 md:p-8">
      <PageHeader
        section="Contenedores"
        title={`${type ? (CONTAINER_TYPE_LABELS[type as ContainerType] ?? type) : 'Contenedor'} · ${container.containerId.slice(0, 8).toUpperCase()}`}
      />

      <ContainerDetailClient
        container={container}
        containerType={type ?? null}
        lines={lines}
        products={products}
        lots={lots}
        locationCode={locationCode}
        locations={locations}
        events={events}
      />
    </div>
  );
}
