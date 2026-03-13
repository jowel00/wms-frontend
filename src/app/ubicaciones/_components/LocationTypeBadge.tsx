import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { LocationType } from '@/src/types/inventory';

const TYPE_CLASSES: Record<LocationType, string> = {
  PASILLO: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20',
  RACK: 'bg-blue-100 text-blue-800 border-blue-200',
  BIN: 'bg-secondary text-muted-foreground border-border',
};

const TYPE_LABELS: Record<LocationType, string> = {
  PASILLO: 'Pasillo',
  RACK: 'Rack',
  BIN: 'Bin',
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
