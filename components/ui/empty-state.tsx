import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-20 px-4',
        className
      )}
    >
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
        <Icon className="h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-base text-muted-foreground max-w-sm mb-8">{description}</p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          className="h-14 px-8 text-base font-bold uppercase tracking-wider"
          size="lg"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
