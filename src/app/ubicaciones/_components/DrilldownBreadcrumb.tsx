'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string; // sin href → ítem actual (no clickeable)
}

interface DrilldownBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DrilldownBreadcrumb({ items }: DrilldownBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
          {item.href ? (
            <Link
              href={item.href}
              className="font-mono font-semibold text-primary hover:underline underline-offset-4"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-mono font-bold text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
