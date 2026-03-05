'use client';

import { Search, Loader2 } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
  className?: string;
}

export function SearchInput({
  placeholder = 'Buscar...',
  paramName = 'q',
  value,
  onChange,
  isPending = false,
  className,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      const params = new URLSearchParams(searchParams.toString());
      if (newValue) {
        params.set(paramName, newValue);
      } else {
        params.delete(paramName);
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [onChange, paramName, pathname, router, searchParams]
  );

  return (
    <div className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors',
          isPending ? 'opacity-0' : 'text-muted-foreground'
        )}
      />
      {isPending && (
        <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
      )}
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-12 h-14 text-base"
      />
    </div>
  );
}
