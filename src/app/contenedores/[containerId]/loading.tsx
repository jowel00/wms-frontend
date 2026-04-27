import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function ContainerDetailLoading() {
  return (
    <div className="p-6 md:p-8">
      <Skeleton className="h-4 w-40 mb-6" />
      <header className="mb-8">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-9 w-64 mb-3" />
      </header>
      <div className="flex gap-6 mb-8 p-5 rounded-xl border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-32 mb-5" />
      <TableSkeleton columns={5} rows={4} />
    </div>
  );
}
