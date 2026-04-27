'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Owner } from '@/src/types/inventory';

interface ProductOwnerFilterProps {
  owners: Owner[];
  initialValue: string;
}

export function ProductOwnerFilter({ owners, initialValue }: ProductOwnerFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  function handleChange(value: string) {
    const params = new URLSearchParams(window.location.search);
    if (value && value !== '__all__') {
      params.set('ownerId', value);
    } else {
      params.delete('ownerId');
    }
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select defaultValue={initialValue || '__all__'} onValueChange={handleChange}>
      <SelectTrigger className="h-14 w-full sm:w-56 text-base">
        <SelectValue placeholder="Todos los owners" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__" className="text-base py-3">
          Todos los owners
        </SelectItem>
        {activeOwners.map((o) => (
          <SelectItem key={o.ownerId} value={o.ownerId} className="text-base py-3">
            {o.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
