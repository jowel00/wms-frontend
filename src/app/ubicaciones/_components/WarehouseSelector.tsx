'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Warehouse } from '@/src/types/inventory';

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
  value: string;
}

export function WarehouseSelector({ warehouses, value }: WarehouseSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(warehouseId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('warehouseId', warehouseId);
    params.delete('q');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
        Bodega
      </label>
      <Select value={value || undefined} onValueChange={handleChange}>
        <SelectTrigger
          className={cn(
            'w-80 h-16 text-base font-semibold',
            !value && 'border-primary border-2 text-primary'
          )}
        >
          <SelectValue placeholder="↓ Selecciona una bodega para empezar" />
        </SelectTrigger>
        <SelectContent>
          {warehouses.map((w) => (
            <SelectItem key={w.warehouseId} value={w.warehouseId} className="text-base py-3">
              <span className="font-semibold">{w.name}</span>
              <span className="ml-2 text-muted-foreground text-sm">{w.city}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
