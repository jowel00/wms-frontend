import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LocationType } from '@/src/types/inventory';

const TYPE_CLASSES: Record<LocationType, string> = {
  RACK: 'bg-blue-100 text-blue-800 border-blue-200',
  BIN: 'bg-secondary text-muted-foreground border-border',
  STAGING: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  PACKING: 'bg-purple-100 text-purple-800 border-purple-200',
  RETURNS: 'bg-destructive/10 text-destructive border-destructive/20',
};

const TYPE_LABELS: Record<LocationType, string> = {
  RACK: 'Rack',
  BIN: 'Bin',
  STAGING: 'Staging',
  PACKING: 'Packing',
  RETURNS: 'Devoluciones',
};

interface LocationTypeBadgeProps {
  type: LocationType;
}

export function LocationTypeBadge({ type }: LocationTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', TYPE_CLASSES[type])}>
      {TYPE_LABELS[type]}
    </Badge>
  );
}
