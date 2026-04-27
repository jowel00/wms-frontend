import { notFound } from 'next/navigation';
import { fetchContainerById } from '@/src/services/containerService';
import { fetchContainerLines } from '@/src/services/containerLineService';
import { fetchAllLocations } from '@/src/services/locationService';
import { fetchProducts } from '@/src/services/productService';
import { fetchLots } from '@/src/services/lotService';
import { ContainerDetailClient } from './_components/ContainerDetailClient';

interface PageProps {
  params: Promise<{ containerId: string }>;
}

export default async function ContainerDetailPage({ params }: PageProps) {
  const { containerId } = await params;

  const container = await fetchContainerById(containerId).catch(() => null);
  if (!container) notFound();

  const [lines, locations, productsData, allLots] = await Promise.all([
    fetchContainerLines(containerId).catch(() => []),
    fetchAllLocations(container.warehouseId).catch(() => []),
    fetchProducts({ ownerId: container.ownerId, limit: 100, page: 1 }).catch(() => null),
    fetchLots().catch(() => []),
  ]);

  const locationCode =
    locations.find((l) => l.locationId === container.locationId)?.code ?? '—';

  const products = productsData?.data ?? [];
  const lots = allLots.filter((l) => l.ownerId === container.ownerId);

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          Contenedores
        </p>
        <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
          {container.type.toUpperCase()} · {container.containerId.slice(0, 8).toUpperCase()}
        </h1>
      </header>

      <ContainerDetailClient
        container={container}
        lines={lines}
        products={products}
        lots={lots}
        locationCode={locationCode}
      />
    </div>
  );
}
