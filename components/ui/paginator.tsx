'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  /** full = Primero+Anterior+páginas+Siguiente+Último  |  compact = Anterior+páginas+Siguiente */
  variant?: 'full' | 'compact';
  className?: string;
}

/** Devuelve un array de números de página centrado en `current`. */
function getPageWindow(current: number, total: number, windowSize = 5): number[] {
  if (total <= windowSize) return Array.from({ length: total }, (_, i) => i + 1);

  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(total, start + windowSize - 1);

  // Si el extremo derecho aprieta, desplazar el inicio hacia la izquierda
  if (end - start + 1 < windowSize) {
    start = Math.max(1, end - windowSize + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function Paginator({ currentPage, totalPages, variant = 'full', className }: PaginatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigateTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (totalPages <= 1) return null;

  const pages = getPageWindow(currentPage, totalPages);
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {variant === 'full' && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateTo(1)}
          disabled={isFirst}
          aria-label="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateTo(currentPage - 1)}
        disabled={isFirst}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === currentPage ? 'default' : 'outline'}
          size="icon"
          onClick={() => p !== currentPage && navigateTo(p)}
          className={cn(p === currentPage && 'pointer-events-none')}
          aria-label={`Página ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateTo(currentPage + 1)}
        disabled={isLast}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {variant === 'full' && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateTo(totalPages)}
          disabled={isLast}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
