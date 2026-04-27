import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === 'ACTIVE') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'bg-green-100 text-green-800 border-green-200 font-medium',
          className
        )}
      >
        Activo
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className={cn('text-muted-foreground font-medium', className)}>
      Inactivo
    </Badge>
  );
}
