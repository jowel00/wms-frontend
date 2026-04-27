'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Owner } from '@/src/types/inventory';

interface OwnerFilterSelectProps {
  owners: Owner[];
  value: string;
  onChange: (value: string) => void;
}

export function OwnerFilterSelect({ owners, value, onChange }: OwnerFilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeOwners = owners.filter((o) => o.status === 'ACTIVE');

  function handleChange(val: string) {
    const newVal = val === '__all__' ? '' : val;
    onChange(newVal);
    const params = new URLSearchParams(searchParams.toString());
    if (newVal) {
      params.set('ownerId', newVal);
    } else {
      params.delete('ownerId');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={value || '__all__'} onValueChange={handleChange}>
      <SelectTrigger className="w-60 h-14 text-base">
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
