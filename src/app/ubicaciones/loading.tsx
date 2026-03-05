import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function UbicacionesLoading() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-9 w-40 mb-3" />
        <Skeleton className="h-4 w-80" />
      </header>
      <div className="mb-4">
        <Skeleton className="h-14 w-72 rounded-lg" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-14 w-72 rounded-lg" />
        <Skeleton className="h-14 w-48 ml-auto rounded-lg" />
      </div>
      <TableSkeleton columns={7} rows={6} />
    </div>
  );
}
