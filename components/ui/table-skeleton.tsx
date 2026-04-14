import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 bg-primary">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="py-4">
                <Skeleton className="h-3 w-20 bg-primary-foreground/20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i} className="border-b border-primary/10">
              {Array.from({ length: columns }).map((_, j) => (
                <TableCell key={j} className="py-5">
                  <Skeleton
                    className="h-5"
                    style={{ width: `${60 + ((i * 3 + j * 7) % 30)}%` }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
