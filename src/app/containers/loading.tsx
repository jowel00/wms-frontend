import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function ContenedoresLoading() {
  return (
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-9 w-48 mb-3" />
        <Skeleton className="h-4 w-80" />
      </header>
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16 mb-1.5" />
          <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16 mb-1.5" />
          <Skeleton className="h-16 w-64 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-4 w-48 mb-5" />
      <TableSkeleton columns={5} rows={6} />
    </div>
  );
}
