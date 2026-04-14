import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function BodegasLoading() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-9 w-32 mb-3" />
        <Skeleton className="h-4 w-80" />
      </header>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Skeleton className="h-14 w-72 rounded-lg" />
        <Skeleton className="h-14 w-52 rounded-lg" />
        <Skeleton className="h-14 w-44 ml-auto rounded-lg" />
      </div>
      <TableSkeleton columns={6} rows={6} />
    </div>
  );
}
