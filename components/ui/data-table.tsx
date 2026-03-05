import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  isOptimistic?: (row: T) => boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isOptimistic,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 bg-primary">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  'py-4 text-xs font-bold uppercase tracking-widest text-primary-foreground/90',
                  col.headerClassName
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={keyExtractor(row)}
              className={cn(
                'border-b border-primary/10',
                isOptimistic?.(row) &&
                  'opacity-50 pointer-events-none bg-primary/5 animate-pulse'
              )}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  className={cn('py-5 text-base', col.className)}
                >
                  {col.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
