import { notFound } from 'next/navigation';
import { fetchContainerById } from '@/src/services/containerService';
import { PageHeader } from '@/components/ui/page-header';
import { fetchContainerLines } from '@/src/services/containerLineService';
import { fetchProducts } from '@/src/services/productService';
import { fetchLots } from '@/src/services/lotService';
import { CONTAINER_TYPE_LABELS } from '@/src/types/inventory';
import type { ContainerType } from '@/src/types/inventory';
import { ContainerDetailClient } from './_components/ContainerDetailClient';

interface PageProps {
  params: Promise<{ containerId: string }>;
  searchParams: Promise<{ ownerId?: string; warehouseId?: string; type?: string }>;
}

export default async function ContainerDetailPage({ params, searchParams }: PageProps) {
  const { containerId } = await params;
  const { ownerId, type } = await searchParams;

  const container = await fetchContainerById(containerId).catch(() => null);
  if (!container) notFound();

  const [lines, productsData, allLots] = await Promise.all([
    fetchContainerLines(containerId).catch(() => []),
    ownerId ? fetchProducts({ ownerId, limit: 100, page: 1 }).catch(() => null) : Promise.resolve(null),
    fetchLots().catch(() => []),
  ]);

  // El backend ya devuelve el código de ubicación directamente
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
      />
    </div>
  );
}
