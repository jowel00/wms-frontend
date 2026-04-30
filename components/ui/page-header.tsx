import { cn } from '@/lib/utils';

interface PageHeaderProps {
  section: string;
  title: string;
  description?: React.ReactNode;
  className?: string;
}

export function PageHeader({ section, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
        {section}
      </p>
      <h1 className="text-3xl font-black text-foreground uppercase leading-none tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      )}
    </header>
  );
}
