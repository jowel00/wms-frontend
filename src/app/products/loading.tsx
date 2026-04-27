import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function Loading() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Barra de búsqueda + select */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Skeleton className="h-14 flex-1" />
        <Skeleton className="h-14 w-full sm:w-56" />
      </div>

      {/* Barra superior: conteo + paginador compacto */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-40" />
      </div>

      <TableSkeleton columns={5} rows={10} />
    </div>
  );
}
