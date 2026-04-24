import { Badge } from '@/components/ui/badge';

interface LotExpirationBadgeProps {
  expiresAt: string | null;
}

export function LotExpirationBadge({ expiresAt }: LotExpirationBadgeProps) {
  if (!expiresAt) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expiresAt + 'T00:00:00');
  const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const formatted = expDate.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  if (diffDays < 0) {
    return (
      <Badge className="bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/15 font-bold text-xs">
        Vencido · {formatted}
      </Badge>
    );
  }
  if (diffDays <= 30) {
    return (
      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/15 font-bold text-xs">
        {diffDays}d · {formatted}
      </Badge>
    );
  }
  return (
    <span className="text-sm text-muted-foreground">{formatted}</span>
  );
}
