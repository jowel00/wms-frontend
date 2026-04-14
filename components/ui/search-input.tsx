'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  /** Texto de ayuda dentro del campo */
  placeholder?: string;
  /** Nombre del query param que se sincroniza con la URL (default: 'q') */
  paramName?: string;
  /** Valor inicial — se toma de searchParams en el Server Component padre */
  initialValue?: string;
  /**
   * Callback opcional que se llama en cada cambio (inmediato, envuelto en
   * useTransition). Úsalo para filtrado local en el cliente.
   */
  onSearch?: (value: string) => void;
  className?: string;
  /**
   * Controles extra (selects, filtros) que se renderizan a la derecha del
   * campo. Cuando se pasa, el componente ocupa todo el ancho disponible con
   * flex y el input toma flex-1.
   */
  filters?: React.ReactNode;
}

export function SearchInput({
  placeholder = 'Buscar...',
  paramName = 'q',
  initialValue = '',
  onSearch,
  className,
  filters,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  // Sincroniza con la URL solo cuando el valor debounced cambia,
  // ignorando el render inicial para no reemplazar la URL al montar.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (debouncedSearch) {
      params.set(paramName, debouncedSearch);
    } else {
      params.delete(paramName);
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, paramName, pathname, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) {
      // useTransition marca el setState del consumidor como no urgente,
      // manteniendo el input responsive durante el filtrado local.
      startTransition(() => onSearch(value));
    }
  }

  const inputEl = (
    <div className={cn('relative', filters ? 'flex-1 min-w-0' : className)}>
      {isPending ? (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin pointer-events-none" />
      ) : (
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      )}
      <Input
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-12 h-14 text-base"
      />
    </div>
  );

  if (filters) {
    return (
      <div className={cn('flex items-center gap-3 flex-wrap', className)}>
        {inputEl}
        {filters}
      </div>
    );
  }

  return inputEl;
}
