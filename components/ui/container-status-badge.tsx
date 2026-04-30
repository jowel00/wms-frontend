import { Badge } from '@/components/ui/badge';
import type { ContainerStatus } from '@/src/types/inventory';

interface ContainerStatusBadgeProps {
  status: ContainerStatus;
}

const STATUS_CONFIG: Record<ContainerStatus, { label: string; className: string }> = {
  CREATED: {
    label: 'Creado',
    className: 'bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/15',
  },
  ACTIVE: {
    label: 'Activo',
    className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15',
  },
  CLOSED: {
    label: 'Cerrado',
    className: '',
  },
  QUARANTINE: {
    label: 'Cuarentena',
    className: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15',
  },
};

export function ContainerStatusBadge({ status }: ContainerStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant={status === 'CLOSED' ? 'secondary' : 'outline'}
      className={`font-bold text-xs uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
